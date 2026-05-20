import { Test, TestingModule } from '@nestjs/testing'

import { AuthController } from '@/modules/auth/controllers/auth.controller'
import { AuthService } from '@/modules/auth/services/auth.service'

describe('AuthController', () => {
  let controller: AuthController
  let authService: jest.Mocked<AuthService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            logout: jest.fn(),
            sendResetPasswordEmail: jest.fn(),
            resetPassword: jest.fn(),
            resendEmailVerification: jest.fn(),
            verifyEmail: jest.fn(),
            refreshAccessToken: jest.fn(),
          },
        },
      ],
    }).compile()

    controller = module.get<AuthController>(AuthController)
    authService = module.get(AuthService)
  })

  it('POST /auth/register: should call authService.register', async () => {
    const body = { name: 'John', email: 'john@test.com', password: 'Pass123!' }
    authService.register.mockResolvedValue({ message: 'ok', data: null } as any)
    await controller.register(body as any)

    expect(authService.register).toHaveBeenCalledWith(body)
  })

  it('POST /auth/login: should call authService.login', async () => {
    const body = { email: 'john@test.com', password: 'Pass123!' }
    authService.login.mockResolvedValue({ message: 'ok', data: null } as any)
    await controller.login(body as any)

    expect(authService.login).toHaveBeenCalledWith(body)
  })

  it('POST /auth/logout: should call authService.logout', async () => {
    authService.logout.mockResolvedValue({ message: 'ok', data: null } as any)
    await controller.logout()

    expect(authService.logout).toHaveBeenCalled()
  })

  it('POST /auth/forgot-password: should call authService.sendResetPasswordEmail', async () => {
    const body = { email: 'john@test.com' }
    await controller.forgotPassword(body as any)
    expect(authService.sendResetPasswordEmail).toHaveBeenCalledWith(body)
  })

  it('POST /auth/reset-password: should call authService.resetPassword', async () => {
    const body = { token: 'xyz', password: 'NewPass123!' }
    await controller.resetPassword(body as any)

    expect(authService.resetPassword).toHaveBeenCalledWith(body)
  })

  it('POST /auth/resend-email-verification: should call authService.resendEmailVerification', async () => {
    const body = { email: 'john@test.com' }
    await controller.resendEmailVerification(body as any)

    expect(authService.resendEmailVerification).toHaveBeenCalledWith(body)
  })

  it('POST /auth/verify-email: should call authService.verifyEmail', async () => {
    const body = { token: 'xyz', password: 'Pass123!' }
    await controller.verifyEmail(body as any)

    expect(authService.verifyEmail).toHaveBeenCalledWith(body)
  })

  it('POST /auth/refresh-access-token: should call authService.refreshAccessToken with request', async () => {
    const body = { refreshToken: 'rt' }
    const request = { body } as any
    await controller.refreshAccessToken(body as any, request)

    expect(authService.refreshAccessToken).toHaveBeenCalledWith(request)
  })
})
