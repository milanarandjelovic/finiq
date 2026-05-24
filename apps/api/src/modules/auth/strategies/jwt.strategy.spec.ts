import { UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { ClsService } from 'nestjs-cls'

import { AuthService } from '@/modules/auth/services/auth.service'
import { JwtStrategy } from '@/modules/auth/strategies/jwt.strategy'

describe('JwtStrategy', () => {
  let strategy: JwtStrategy
  let authService: jest.Mocked<AuthService>
  let clsService: jest.Mocked<ClsService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue({
              secretOrKey: 'access-secret',
              refreshSecret: 'refresh-secret',
              expiresIn: 3600000,
              refreshExpiresIn: 604800000,
            }),
          },
        },
        {
          provide: AuthService,
          useValue: { validateUser: jest.fn() },
        },
        {
          provide: ClsService,
          useValue: { set: jest.fn() },
        },
      ],
    }).compile()

    strategy = module.get<JwtStrategy>(JwtStrategy)
    authService = module.get(AuthService)
    clsService = module.get(ClsService)
  })

  it('should be defined', () => {
    expect(strategy).toBeDefined()
  })

  it('validate: should call authService.validateUser with payload', async () => {
    const user = { id: '1', email: 'test@test.com' }
    authService.validateUser.mockResolvedValue(user as any)

    const result = await strategy.validate({
      userId: '1',
      email: 'test@test.com',
    })

    expect(authService.validateUser).toHaveBeenCalledWith({
      userId: '1',
      email: 'test@test.com',
    })
    expect(result).toBe(user)
  })

  it('validate: should set userId in CLS', async () => {
    const user = { id: '1', email: 'test@test.com' }
    authService.validateUser.mockResolvedValue(user as any)
    await strategy.validate({ userId: '1', email: 'test@test.com' })

    expect(clsService.set).toHaveBeenCalledWith('userId', '1')
  })

  it('validate: should throw UnauthorizedException when user is null', async () => {
    authService.validateUser.mockResolvedValue(null as any)

    await expect(
      strategy.validate({ userId: '1', email: 'test@test.com' }),
    ).rejects.toThrow(UnauthorizedException)
  })
})
