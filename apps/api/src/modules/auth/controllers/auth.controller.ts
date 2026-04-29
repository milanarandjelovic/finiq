import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { Request } from 'express'

import { TransformInterceptor } from '@/interceptors/transform.interceptor'
import { ThrottleTier } from '@/modules/auth/decorators/throttle-tier.decorator'
import { ForgotPasswordEmailNotEmptyDto } from '@/modules/auth/dtos/forgot-password/forgot-password-email-not-empty.dto'
import { ForgotPasswordEmailNotFoundDto } from '@/modules/auth/dtos/forgot-password/forgot-password-email-not-found.dto'
import { ForgotPasswordPayloadDto } from '@/modules/auth/dtos/forgot-password/forgot-password-payload.dto'
import { ForgotPasswordResponseDto } from '@/modules/auth/dtos/forgot-password/forgot-password-response.dto'
import { LoginEmailNotActivatedDto } from '@/modules/auth/dtos/login/login-email-not-activated.dto'
import { LoginEmailNotFoundDto } from '@/modules/auth/dtos/login/login-email-not-found.dto'
import { LoginPayloadDto } from '@/modules/auth/dtos/login/login-payload.dto'
import { LoginResponseDto } from '@/modules/auth/dtos/login/login-response.dto'
import { LogoutResponseDto } from '@/modules/auth/dtos/logout/logout-response.dto'
import { RefreshAccessTokenNotFoundDto } from '@/modules/auth/dtos/refresh-access-token/refresh-access-token-not-found.dto'
import { RefreshAccessTokenPayloadDto } from '@/modules/auth/dtos/refresh-access-token/refresh-access-token-payload.dto'
import { RefreshAccessTokenResponseDto } from '@/modules/auth/dtos/refresh-access-token/refresh-access-token-response.dto'
import { RefreshAccessTokenUnauthorizedDto } from '@/modules/auth/dtos/refresh-access-token/refresh-access-token-unauthorized.dto'
import { RegisterEmailExistsDto } from '@/modules/auth/dtos/register/register-email-exists.dto'
import { RegisterEmailUniqueDto } from '@/modules/auth/dtos/register/register-email-unique.dto'
import { RegisterEmailValidDto } from '@/modules/auth/dtos/register/register-email-valid.dto'
import { RegisterPayloadDto } from '@/modules/auth/dtos/register/register-payload.dto'
import { RegisterResponseDto } from '@/modules/auth/dtos/register/register-response.dto'
import { ResendEmailVerificationPayloadDto } from '@/modules/auth/dtos/resend-email-verification/resend-email-verification-payload.dto'
import { ResendEmailVerificationResponseDto } from '@/modules/auth/dtos/resend-email-verification/resend-email-verification-response.dto'
import { ResendEmailVerificationUserNotFoundDto } from '@/modules/auth/dtos/resend-email-verification/resend-email-verification-user-not-found.dto'
import { ResetPasswordPayloadDto } from '@/modules/auth/dtos/reset-password/reset-password-payload.dto'
import { ResetPasswordResponseDto } from '@/modules/auth/dtos/reset-password/reset-password-response.dto'
import { ResetPasswordTokenExpiredDto } from '@/modules/auth/dtos/reset-password/reset-password-token-expired.dto'
import { ResetPasswordTokenNotFoundDto } from '@/modules/auth/dtos/reset-password/reset-password-token-not-found.dto'
import { VerifyEmailPayloadDto } from '@/modules/auth/dtos/verify-email/verify-email-payload.dto'
import { VerifyEmailResponseDto } from '@/modules/auth/dtos/verify-email/verify-email-response.dto'
import { VerifyEmailTokenExpiredDto } from '@/modules/auth/dtos/verify-email/verify-email-token-expired.dto'
import { VerifyEmailTokenNotFoundDto } from '@/modules/auth/dtos/verify-email/verify-email-token-not-found.dto'
import { JwtAuthenticationGuard } from '@/modules/auth/guards/jwt-authentication.guard'
import { JwtRefreshTokenGuard } from '@/modules/auth/guards/jwt-refresh-token.guard'
import { AuthService } from '@/modules/auth/services/auth.service'
import { ApiRestfulResponse } from '@/shared/decorators/api-restful-response.decorator'
import { RestfulResponseDto } from '@/shared/dtos/restful-response.dto'
import { UnauthorizedDto } from '@/shared/dtos/unauthorized.dto'

@Controller('auth')
@ApiTags('Auth')
@UseInterceptors(TransformInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @ThrottleTier('auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Register' })
  @ApiRestfulResponse({
    model: RegisterResponseDto,
    status: HttpStatus.OK,
    description: 'User registered successfully.',
  })
  @ApiRestfulResponse({
    model: [
      RegisterEmailExistsDto,
      RegisterEmailUniqueDto,
      RegisterEmailValidDto,
    ],
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation Exception',
  })
  async register(
    @Body() body: RegisterPayloadDto,
  ): Promise<RestfulResponseDto<RegisterResponseDto>> {
    return await this.authService.register(body)
  }

  @Post('/login')
  @ThrottleTier('auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login' })
  @ApiRestfulResponse({
    model: LoginResponseDto,
    status: HttpStatus.OK,
    description: 'User logged in successfully.',
  })
  @ApiRestfulResponse({
    model: [LoginEmailNotFoundDto, LoginEmailNotActivatedDto],
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation Exception',
  })
  async login(
    @Body() body: LoginPayloadDto,
  ): Promise<RestfulResponseDto<LoginResponseDto>> {
    return await this.authService.login(body)
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout' })
  @ApiRestfulResponse({
    model: LogoutResponseDto,
    status: HttpStatus.OK,
    description: 'Successfully logout.',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedDto,
    description: 'Unauthorized',
  })
  @UseGuards(JwtAuthenticationGuard)
  async logout(): Promise<RestfulResponseDto<LogoutResponseDto>> {
    return await this.authService.logout()
  }

  @Post('/forgot-password')
  @ThrottleTier('sensitive')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Forgot Password' })
  @ApiRestfulResponse({
    model: ForgotPasswordResponseDto,
    status: HttpStatus.OK,
    description: 'Reset password email sent successfully.',
  })
  @ApiRestfulResponse({
    model: [ForgotPasswordEmailNotEmptyDto, ForgotPasswordEmailNotFoundDto],
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation Exception',
  })
  async forgotPassword(
    @Body() body: ForgotPasswordPayloadDto,
  ): Promise<RestfulResponseDto<ForgotPasswordResponseDto>> {
    return await this.authService.sendResetPasswordEmail(body)
  }

  @Post('/reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset Password' })
  @ApiRestfulResponse({
    model: ResetPasswordResponseDto,
    status: HttpStatus.OK,
    description: 'Password reset successfully.',
  })
  @ApiRestfulResponse({
    model: [ResetPasswordTokenNotFoundDto, ResetPasswordTokenExpiredDto],
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation Exception',
  })
  async resetPassword(
    @Body() body: ResetPasswordPayloadDto,
  ): Promise<RestfulResponseDto<ResetPasswordResponseDto>> {
    return await this.authService.resetPassword(body)
  }

  @Post('/resend-email-verification')
  @ThrottleTier('sensitive')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend Email Verification' })
  @ApiRestfulResponse({
    model: ResendEmailVerificationResponseDto,
    status: HttpStatus.OK,
    description: 'Email verification resent successfully.',
  })
  @ApiRestfulResponse({
    model: [ResendEmailVerificationUserNotFoundDto],
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation Exception',
  })
  async resendEmailVerification(
    @Body() body: ResendEmailVerificationPayloadDto,
  ): Promise<RestfulResponseDto<ResendEmailVerificationResponseDto>> {
    return await this.authService.resendEmailVerification(body)
  }

  @Post('/verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify Email',
    description:
      'Verifies the email token and activates the account. On success, an account activation confirmation email is sent to the user.',
  })
  @ApiRestfulResponse({
    model: VerifyEmailResponseDto,
    status: HttpStatus.OK,
    description: 'Email verified and account activated successfully.',
  })
  @ApiRestfulResponse({
    model: [VerifyEmailTokenNotFoundDto, VerifyEmailTokenExpiredDto],
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation Exception',
  })
  async verifyEmail(
    @Body() body: VerifyEmailPayloadDto,
  ): Promise<RestfulResponseDto<VerifyEmailResponseDto>> {
    return await this.authService.verifyEmail(body)
  }

  @Post('/refresh-access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh Access Token' })
  @ApiRestfulResponse({
    model: RefreshAccessTokenResponseDto,
    status: HttpStatus.OK,
    description: 'Access token refreshed successfully.',
  })
  @ApiNotFoundResponse({
    type: RefreshAccessTokenNotFoundDto,
    description: 'Refresh token not found.',
  })
  @ApiUnauthorizedResponse({
    type: RefreshAccessTokenUnauthorizedDto,
    description: 'Unauthorized',
  })
  @ApiBearerAuth('JwtToken')
  @UseGuards(JwtRefreshTokenGuard)
  async refreshAccessToken(
    @Body() body: RefreshAccessTokenPayloadDto,
    @Req() request: Request,
  ): Promise<RestfulResponseDto<RefreshAccessTokenResponseDto>> {
    return await this.authService.refreshAccessToken(request)
  }
}
