import { UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'

import { JwtTokenService } from '@/modules/auth/services/jwt-token.service'
import { JwtRefreshTokenStrategy } from '@/modules/auth/strategies/jwt-refresh-token.strategy'

describe('JwtRefreshTokenStrategy', () => {
  let strategy: JwtRefreshTokenStrategy
  let jwtTokenService: jest.Mocked<JwtTokenService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtRefreshTokenStrategy,
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
          provide: JwtTokenService,
          useValue: { verifyRefreshToken: jest.fn() },
        },
      ],
    }).compile()

    strategy = module.get<JwtRefreshTokenStrategy>(JwtRefreshTokenStrategy)
    jwtTokenService = module.get(JwtTokenService)
  })

  it('should be defined', () => {
    expect(strategy).toBeDefined()
  })

  describe('validate', () => {
    it('should throw UnauthorizedException when refreshToken missing', async () => {
      const request = { body: {} } as any

      await expect(strategy.validate(request, {})).rejects.toThrow(
        UnauthorizedException,
      )
    })

    it('should throw UnauthorizedException when verifyRefreshToken returns falsy', async () => {
      const request = { body: { refreshToken: 'bad-rt' } } as any
      jwtTokenService.verifyRefreshToken.mockResolvedValue(null as any)

      await expect(strategy.validate(request, {})).rejects.toThrow(
        UnauthorizedException,
      )
    })

    it('should verify refresh token and return combined payload', async () => {
      const request = { body: { refreshToken: 'valid-rt' } } as any
      const payload = { userId: '1', email: 'test@test.com' }
      jwtTokenService.verifyRefreshToken.mockResolvedValue(payload)
      const result = await strategy.validate(request, payload)

      expect(jwtTokenService.verifyRefreshToken).toHaveBeenCalledWith(
        'valid-rt',
      )
      expect(result).toEqual({
        ...payload,
        verifyRefreshToken: payload,
      })
    })
  })
})
