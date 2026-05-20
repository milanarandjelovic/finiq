import { NotFoundException, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { ValidationException } from '@/exceptions/validation.exception'
import { EmailVerification } from '@/modules/auth/entities/email-verification.entity'
import { PasswordReset } from '@/modules/auth/entities/password-reset.entity'
import { AuthService } from '@/modules/auth/services/auth.service'
import { JwtTokenService } from '@/modules/auth/services/jwt-token.service'
import { User } from '@/modules/user/entities/user.entity'
import { EmailService } from '@/providers/email/services/email.service'

describe('AuthService', () => {
  let service: AuthService
  let userRepository: jest.Mocked<Repository<User>>
  let emailVerificationRepository: jest.Mocked<Repository<EmailVerification>>
  let passwordResetRepository: jest.Mocked<Repository<PasswordReset>>
  let jwtTokenService: jest.Mocked<JwtTokenService>
  let emailService: jest.Mocked<EmailService>

  const mockUser = {
    id: '1',
    name: 'John',
    email: 'john@example.com',
    password: 'hashed',
    activatedAt: null,
    save: jest.fn(),
  } as any

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            create: jest.fn().mockReturnValue(mockUser),
          },
        },
        {
          provide: getRepositoryToken(EmailVerification),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn().mockReturnValue({ save: jest.fn() }),
            createQueryBuilder: jest.fn(() => ({
              delete: jest.fn().mockReturnThis(),
              from: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              execute: jest.fn(),
            })),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(PasswordReset),
          useValue: {
            create: jest.fn().mockReturnValue({ save: jest.fn() }),
            findOne: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              delete: jest.fn().mockReturnThis(),
              from: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              execute: jest.fn(),
            })),
          },
        },
        {
          provide: JwtTokenService,
          useValue: {
            generateTokens: jest.fn(),
            generateAccessToken: jest.fn(),
            verifyRefreshToken: jest.fn(),
          },
        },
        {
          provide: EmailService,
          useValue: { send: jest.fn() },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'clientUrl') return 'http://localhost:3000'
              if (key === 'email') return { from: 'noreply@test.com' }
              return undefined
            }),
          },
        },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
    userRepository = module.get(getRepositoryToken(User))
    emailVerificationRepository = module.get(
      getRepositoryToken(EmailVerification),
    )
    passwordResetRepository = module.get(getRepositoryToken(PasswordReset))
    jwtTokenService = module.get(JwtTokenService)
    emailService = module.get(EmailService)
  })

  describe('register', () => {
    it('should create user and send verification email', async () => {
      const data = {
        name: 'John',
        email: 'john@example.com',
        password: 'Pass123!',
      }
      ;(userRepository.create as jest.Mock).mockReturnValue({
        ...mockUser,
        save: jest.fn().mockResolvedValue(mockUser),
      })
      const result = await service.register(data as any)

      expect(emailService.send).toHaveBeenCalled()
      expect(result.message).toBe('User registered successfully.')
    })
  })

  describe('login', () => {
    it('should throw ValidationException when email not found', async () => {
      userRepository.findOne.mockResolvedValue(null)

      await expect(
        service.login({ email: 'none@example.com', password: 'x' } as any),
      ).rejects.toThrow(ValidationException)
    })

    it('should throw ValidationException when account not activated', async () => {
      userRepository.findOne.mockResolvedValue(mockUser)

      await expect(
        service.login({ email: 'john@example.com', password: 'x' } as any),
      ).rejects.toThrow(ValidationException)
    })

    it('should return access and refresh tokens on success', async () => {
      const activatedUser = { ...mockUser, activatedAt: new Date() }
      userRepository.findOne.mockResolvedValue(activatedUser)
      jwtTokenService.generateTokens.mockResolvedValue({
        accessToken: 'at',
        refreshToken: 'rt',
      })
      const result = await service.login({
        email: 'john@example.com',
        password: 'x',
      } as any)

      expect(result.data.accessToken).toBe('at')
      expect(result.data.refreshToken).toBe('rt')
    })
  })

  describe('logout', () => {
    it('should return logout confirmation', async () => {
      const result = await service.logout()

      expect(result.data.logout).toBe(true)
    })
  })

  describe('sendResetPasswordEmail', () => {
    it('should throw when email not found', async () => {
      userRepository.findOne.mockResolvedValue(null)

      await expect(
        service.sendResetPasswordEmail({ email: 'none@example.com' } as any),
      ).rejects.toThrow(ValidationException)
    })

    it('should delete old resets, create new one, and send email on success', async () => {
      userRepository.findOne.mockResolvedValue(mockUser)
      const deleteMock = jest.fn().mockReturnThis()
      const executeMock = jest.fn()
      ;(
        passwordResetRepository.createQueryBuilder as jest.Mock
      ).mockReturnValue({
        delete: deleteMock,
        from: deleteMock,
        where: deleteMock,
        execute: executeMock,
      })
      const saveMock = jest.fn()
      ;(passwordResetRepository.create as jest.Mock).mockReturnValue({
        save: saveMock,
      })
      const result = await service.sendResetPasswordEmail({
        email: 'john@example.com',
      } as any)

      expect(emailService.send).toHaveBeenCalled()
      expect(result.message).toBe('Reset password email sent successfully.')
    })
  })

  describe('resetPassword', () => {
    it('should throw when token not found', async () => {
      passwordResetRepository.findOne.mockResolvedValue(null)

      await expect(
        service.resetPassword({ token: 'invalid', password: 'x' } as any),
      ).rejects.toThrow(ValidationException)
    })

    it('should throw when token is expired', async () => {
      const expiredReset = {
        token: 'expired',
        expiresAt: new Date(Date.now() - 60000),
        user: { id: 'user-1', save: jest.fn() },
      }
      passwordResetRepository.findOne.mockResolvedValue(expiredReset as any)

      await expect(
        service.resetPassword({
          token: 'expired',
          password: 'NewPass1!',
        } as any),
      ).rejects.toThrow(ValidationException)
    })

    it('should reset password and return user on success', async () => {
      const validReset = {
        token: 'valid',
        expiresAt: new Date(Date.now() + 60000),
        user: {
          id: 'user-1',
          email: 'john@example.com',
          save: jest.fn(),
          password: 'old',
        },
      }
      passwordResetRepository.findOne.mockResolvedValue(validReset as any)
      const deleteMock = jest.fn().mockReturnThis()
      const executeMock = jest.fn()
      ;(
        passwordResetRepository.createQueryBuilder as jest.Mock
      ).mockReturnValue({
        delete: deleteMock,
        from: deleteMock,
        where: deleteMock,
        execute: executeMock,
      })
      const result = await service.resetPassword({
        token: 'valid',
        password: 'NewPass1!',
      } as any)

      expect(validReset.user.save).toHaveBeenCalled()
      expect(result.message).toBe('Password reset successfully.')
    })
  })

  describe('resendEmailVerification', () => {
    it('should throw when user not found', async () => {
      userRepository.findOne.mockResolvedValue(null)

      await expect(
        service.resendEmailVerification({ email: 'none@example.com' } as any),
      ).rejects.toThrow(ValidationException)
    })

    it('should delete old verification, create new one, and send email on success', async () => {
      userRepository.findOne.mockResolvedValue(mockUser)
      const deleteMock = jest.fn().mockReturnThis()
      const executeMock = jest.fn()
      ;(
        emailVerificationRepository.createQueryBuilder as jest.Mock
      ).mockReturnValue({
        delete: deleteMock,
        from: deleteMock,
        where: deleteMock,
        execute: executeMock,
      })
      const saveMock = jest.fn()
      ;(emailVerificationRepository.create as jest.Mock).mockReturnValue({
        save: saveMock,
      })
      const result = await service.resendEmailVerification({
        email: 'john@example.com',
      } as any)

      expect(emailService.send).toHaveBeenCalled()
      expect(result.message).toBe('Email verification resent successfully.')
    })
  })

  describe('verifyEmail', () => {
    it('should throw when token not found', async () => {
      emailVerificationRepository.findOne.mockResolvedValue(null)

      await expect(
        service.verifyEmail({ token: 'invalid' } as any),
      ).rejects.toThrow(ValidationException)
    })

    it('should throw when token is expired', async () => {
      const expiredVerification = {
        token: 'expired',
        expiresAt: new Date(Date.now() - 60000),
        user: { activatedAt: null },
      }
      emailVerificationRepository.findOne.mockResolvedValue(
        expiredVerification as any,
      )

      await expect(
        service.verifyEmail({ token: 'expired', password: 'Pass1!' } as any),
      ).rejects.toThrow(ValidationException)
    })

    it('should throw when account is already activated', async () => {
      const alreadyActivated = {
        token: 'valid',
        expiresAt: new Date(Date.now() + 60000),
        user: { activatedAt: new Date() },
      }
      emailVerificationRepository.findOne.mockResolvedValue(
        alreadyActivated as any,
      )

      await expect(
        service.verifyEmail({ token: 'valid', password: 'Pass1!' } as any),
      ).rejects.toThrow(ValidationException)
    })

    it('should activate account and send confirmation email on success', async () => {
      const validVerification = {
        token: 'valid',
        expiresAt: new Date(Date.now() + 60000),
        user: {
          id: 'user-1',
          email: 'john@example.com',
          name: 'John',
          activatedAt: null,
          password: null,
          save: jest.fn(),
        },
      }
      emailVerificationRepository.findOne.mockResolvedValue(
        validVerification as any,
      )
      const deleteMock = jest.fn().mockReturnThis()
      const executeMock = jest.fn()
      ;(
        emailVerificationRepository.createQueryBuilder as jest.Mock
      ).mockReturnValue({
        delete: deleteMock,
        from: deleteMock,
        where: deleteMock,
        execute: executeMock,
      })
      const result = await service.verifyEmail({
        token: 'valid',
        password: 'Pass1!',
      } as any)

      expect(validVerification.user.save).toHaveBeenCalled()
      expect(emailService.send).toHaveBeenCalled()
      expect(result.message).toBe('Email verified successfully.')
    })
  })

  describe('refreshAccessToken', () => {
    it('should throw when refresh token missing', async () => {
      const request = { body: {} } as any

      await expect(service.refreshAccessToken(request)).rejects.toThrow(
        NotFoundException,
      )
    })

    it('should throw when refresh token invalid', async () => {
      const request = { body: { refreshToken: 'bad' } } as any
      jwtTokenService.verifyRefreshToken.mockResolvedValue(null as any)

      await expect(service.refreshAccessToken(request)).rejects.toThrow(
        UnauthorizedException,
      )
    })

    it('should return new access token when refresh token is valid and user exists', async () => {
      const payload = { userId: '1', email: 'john@example.com' }
      const request = { body: { refreshToken: 'valid-rt' } } as any
      jwtTokenService.verifyRefreshToken.mockResolvedValue(payload as any)
      userRepository.findOne.mockResolvedValue(mockUser)
      jwtTokenService.generateAccessToken.mockResolvedValue('new-access-token')
      const result = await service.refreshAccessToken(request)

      expect(result.data.accessToken).toBe('new-access-token')
      expect(result.message).toBe('Access token refreshed successfully.')
    })

    it('should throw UnauthorizedException when user not found after token verification', async () => {
      const payload = { userId: 'missing', email: 'x@x.com' }
      const request = { body: { refreshToken: 'valid-rt' } } as any
      jwtTokenService.verifyRefreshToken.mockResolvedValue(payload as any)
      userRepository.findOne.mockResolvedValue(null)

      await expect(service.refreshAccessToken(request)).rejects.toThrow(
        UnauthorizedException,
      )
    })
  })

  describe('validateUser', () => {
    it('should throw UnauthorizedException when user not found', async () => {
      userRepository.findOne.mockResolvedValue(null)

      await expect(
        service.validateUser({ userId: '1', email: 'x@x.com' }),
      ).rejects.toThrow(UnauthorizedException)
    })

    it('should return user when found with matching email', async () => {
      const user = { id: '1', email: 'john@example.com' } as any
      userRepository.findOne.mockResolvedValue(user)
      const result = await service.validateUser({
        userId: '1',
        email: 'john@example.com',
      })

      expect(result).toEqual(user)
    })

    it('should throw UnauthorizedException when email does not match', async () => {
      const user = { id: '1', email: 'real@example.com' } as any
      userRepository.findOne.mockResolvedValue(user)

      await expect(
        service.validateUser({ userId: '1', email: 'wrong@example.com' }),
      ).rejects.toThrow(UnauthorizedException)
    })
  })
})
