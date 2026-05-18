import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Request } from 'express'
import { Repository } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

import { Configuration } from '@/config/interfaces/configuration.interface'
import { ValidationException } from '@/exceptions/validation.exception'
import { ForgotPasswordPayloadDto } from '@/modules/auth/dtos/forgot-password/forgot-password-payload.dto'
import { ForgotPasswordResponseDto } from '@/modules/auth/dtos/forgot-password/forgot-password-response.dto'
import { LoginPayloadDto } from '@/modules/auth/dtos/login/login-payload.dto'
import { LoginResponseDto } from '@/modules/auth/dtos/login/login-response.dto'
import { LogoutResponseDto } from '@/modules/auth/dtos/logout/logout-response.dto'
import { RefreshAccessTokenResponseDto } from '@/modules/auth/dtos/refresh-access-token/refresh-access-token-response.dto'
import { RegisterPayloadDto } from '@/modules/auth/dtos/register/register-payload.dto'
import { RegisterResponseDto } from '@/modules/auth/dtos/register/register-response.dto'
import { ResendEmailVerificationPayloadDto } from '@/modules/auth/dtos/resend-email-verification/resend-email-verification-payload.dto'
import { ResendEmailVerificationResponseDto } from '@/modules/auth/dtos/resend-email-verification/resend-email-verification-response.dto'
import { ResetPasswordPayloadDto } from '@/modules/auth/dtos/reset-password/reset-password-payload.dto'
import { ResetPasswordResponseDto } from '@/modules/auth/dtos/reset-password/reset-password-response.dto'
import { VerifyEmailPayloadDto } from '@/modules/auth/dtos/verify-email/verify-email-payload.dto'
import { VerifyEmailResponseDto } from '@/modules/auth/dtos/verify-email/verify-email-response.dto'
import { EmailVerification } from '@/modules/auth/entities/email-verification.entity'
import { PasswordReset } from '@/modules/auth/entities/password-reset.entity'
import { JwtPayloadInterface } from '@/modules/auth/interfaces/jwt-payload.interface'
import { JwtTokenService } from '@/modules/auth/services/jwt-token.service'
import { User } from '@/modules/user/entities/user.entity'
import { EmailService } from '@/providers/email/services/email.service'
import { RestfulResponseDto } from '@/shared/dtos/restful-response.dto'

@Injectable()
export class AuthService {
  private readonly clientUrl: string
  private readonly emailFrom: string

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly emailService: EmailService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(EmailVerification)
    private readonly emailVerificationRepository: Repository<EmailVerification>,
    @InjectRepository(PasswordReset)
    private readonly passwordResetRepository: Repository<PasswordReset>,
  ) {
    this.clientUrl =
      this.configService.get<Configuration['clientUrl']>('clientUrl')
    this.emailFrom =
      this.configService.get<Configuration['email']>('email').from
  }

  async register(
    data: RegisterPayloadDto,
  ): Promise<RestfulResponseDto<RegisterResponseDto>> {
    const { name, email, password } = data

    const token = uuidv4()

    const user = await this.userRepository
      .create({
        name,
        email,
        password,
      })
      .save()

    await this.emailVerificationRepository
      .create({
        token,
        user,
      })
      .save()

    await this.emailService.send({
      subject: 'Email Verification',
      from: this.emailFrom,
      to: user.email,
      template: 'auth/email-verification',
      context: {
        name: user.name,
        link: `${this.clientUrl}/auth/verify-email/${token}`,
      },
    })

    return new RestfulResponseDto<RegisterResponseDto>({
      message: 'User registered successfully.',
      data: {
        user,
      },
    })
  }

  async login(
    data: LoginPayloadDto,
  ): Promise<RestfulResponseDto<LoginResponseDto>> {
    const { email } = data

    const user = await this.userRepository.findOne({
      where: { email },
    })

    if (!user) {
      throw new ValidationException([
        {
          property: 'email',
          messages: ['api.authUserNotFound'],
        },
      ])
    }

    if (!user.activatedAt) {
      throw new ValidationException([
        {
          property: 'email',
          messages: ['api.authAccountNotActivated'],
        },
      ])
    }

    const payload: JwtPayloadInterface = {
      userId: user.id,
      email: user.email,
    }

    const { accessToken, refreshToken } =
      await this.jwtTokenService.generateTokens(payload)

    return new RestfulResponseDto<LoginResponseDto>({
      message: 'User logged in successfully.',
      data: {
        user,
        accessToken,
        refreshToken,
      },
    })
  }

  async logout(): Promise<RestfulResponseDto<LogoutResponseDto>> {
    return new RestfulResponseDto<LogoutResponseDto>({
      message: 'User logged out successfully.',
      data: {
        logout: true,
      },
    })
  }

  async sendResetPasswordEmail(
    data: ForgotPasswordPayloadDto,
  ): Promise<RestfulResponseDto<ForgotPasswordResponseDto>> {
    const token = uuidv4()
    const { email } = data

    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    })

    if (!user) {
      throw new ValidationException([
        {
          property: 'email',
          messages: ['api.authUserNotFound'],
        },
      ])
    }

    await this.passwordResetRepository
      .createQueryBuilder()
      .delete()
      .from(PasswordReset)
      .where('user_id = :userId', { userId: user.id })
      .execute()

    await this.passwordResetRepository
      .create({
        token,
        user: user,
      })
      .save()

    await this.emailService.send({
      subject: 'Reset Password',
      from: this.emailFrom,
      to: user.email,
      template: 'auth/password-reset',
      context: {
        email: user.email,
        link: `${this.clientUrl}/auth/password/reset/${token}`,
      },
    })

    return new RestfulResponseDto<ForgotPasswordResponseDto>({
      message: 'Reset password email sent successfully.',
      data: {
        user,
      },
    })
  }

  async resetPassword(
    data: ResetPasswordPayloadDto,
  ): Promise<RestfulResponseDto<ResetPasswordResponseDto>> {
    const { password, token } = data

    const passwordReset = await this.passwordResetRepository.findOne({
      where: {
        token,
      },
      relations: {
        user: true,
      },
    })

    if (!passwordReset) {
      throw new ValidationException([
        {
          property: 'token',
          messages: ['api.authResetPasswordTokenNotFound'],
        },
      ])
    }

    if (passwordReset.expiresAt < new Date()) {
      throw new ValidationException([
        {
          property: 'token',
          messages: ['api.authResetPasswordTokenExpired'],
        },
      ])
    }

    passwordReset.user.password = password
    await passwordReset.user.save()

    await this.passwordResetRepository
      .createQueryBuilder()
      .delete()
      .from(PasswordReset)
      .where('user_id = :userId', { userId: passwordReset.user.id })
      .execute()

    return new RestfulResponseDto<ResetPasswordResponseDto>({
      message: 'Password reset successfully.',
      data: {
        user: passwordReset.user,
      },
    })
  }

  async resendEmailVerification(
    data: ResendEmailVerificationPayloadDto,
  ): Promise<RestfulResponseDto<ResendEmailVerificationResponseDto>> {
    const { email } = data

    const token = uuidv4()

    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    })

    if (!user) {
      throw new ValidationException([
        {
          property: 'email',
          messages: ['api.authUserNotFound'],
        },
      ])
    }

    await this.emailVerificationRepository
      .createQueryBuilder()
      .delete()
      .from(EmailVerification)
      .where('user_id = :userId', { userId: user.id })
      .execute()

    await this.emailVerificationRepository
      .create({
        token,
        user: user,
      })
      .save()

    await this.emailService.send({
      subject: 'Email Verification',
      from: this.emailFrom,
      to: user.email,
      template: 'auth/resend-email-verification',
      context: {
        name: user.name,
        link: `${this.clientUrl}/auth/verify-email/${token}`,
      },
    })

    return new RestfulResponseDto<ResendEmailVerificationResponseDto>({
      message: 'Email verification resent successfully.',
      data: {
        user,
      },
    })
  }

  async verifyEmail(
    data: VerifyEmailPayloadDto,
  ): Promise<RestfulResponseDto<VerifyEmailResponseDto>> {
    const { token } = data

    const emailVerification = await this.emailVerificationRepository.findOne({
      where: {
        token,
      },
      relations: ['user'],
    })

    if (!emailVerification) {
      throw new ValidationException([
        {
          property: 'token',
          messages: ['api.authVerifyEmailTokenInvalid'],
        },
      ])
    }

    if (emailVerification.expiresAt < new Date()) {
      throw new ValidationException([
        {
          property: 'token',
          messages: ['api.authVerifyEmailTokenExpired'],
        },
      ])
    }

    if (emailVerification.user.activatedAt) {
      throw new ValidationException([
        {
          property: 'token',
          messages: ['api.authAccountAlreadyActivated'],
        },
      ])
    }

    // Registration creates the account without a password; the user sets it here at verification time.
    emailVerification.user.activatedAt = new Date(Date.now())
    emailVerification.user.password = data.password
    await emailVerification.user.save()

    await this.emailVerificationRepository
      .createQueryBuilder()
      .delete()
      .from(EmailVerification)
      .where('user_id = :userId', { userId: emailVerification.user.id })
      .execute()

    await this.emailService.send({
      subject: 'Account Activated',
      from: this.emailFrom,
      to: emailVerification.user.email,
      template: 'auth/activate-account',
      context: {
        name: emailVerification.user.name,
        loginUrl: `${this.clientUrl}/auth/login`,
      },
    })

    return new RestfulResponseDto<VerifyEmailResponseDto>({
      message: 'Email verified successfully.',
      data: {
        user: emailVerification.user,
      },
    })
  }

  async refreshAccessToken(
    request: Request,
  ): Promise<RestfulResponseDto<RefreshAccessTokenResponseDto>> {
    const refreshToken = request.body.refreshToken

    if (!refreshToken) {
      throw new NotFoundException('Refresh token not found.')
    }

    const verified = await this.jwtTokenService.verifyRefreshToken(refreshToken)

    if (!verified) {
      throw new UnauthorizedException('Not authorized to refresh access token.')
    }

    const user = await this.userRepository.findOne({
      where: {
        id: verified.userId,
      },
    })

    if (!user) {
      throw new UnauthorizedException('Not authorized to refresh access token.')
    }

    const payload: JwtPayloadInterface = {
      userId: user.id,
      email: user.email,
    }

    const accessToken = await this.jwtTokenService.generateAccessToken(payload)

    return new RestfulResponseDto<RefreshAccessTokenResponseDto>({
      message: 'Access token refreshed successfully.',
      data: {
        user,
        accessToken,
      },
    })
  }

  async validateUser(payload: JwtPayloadInterface): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: payload.userId },
      relations: [],
    })

    if (user !== null && user.email === payload.email) {
      return user
    }

    throw new UnauthorizedException()
  }
}
