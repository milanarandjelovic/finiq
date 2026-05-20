import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'

import { JwtTokenService } from '@/modules/auth/services/jwt-token.service'

describe('JwtTokenService', () => {
  let service: JwtTokenService
  let jwtService: jest.Mocked<JwtService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtTokenService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            verifyAsync: jest.fn(),
          },
        },
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
      ],
    }).compile()

    service = module.get<JwtTokenService>(JwtTokenService)
    jwtService = module.get(JwtService)
  })

  it('generateAccessToken: should sign with HS256 and config values', async () => {
    jwtService.signAsync.mockResolvedValue('signed-token')
    const payload = { userId: '1', email: 'test@test.com' }
    const token = await service.generateAccessToken(payload)

    expect(jwtService.signAsync).toHaveBeenCalledWith(payload, {
      algorithm: 'HS256',
      secret: 'access-secret',
      expiresIn: 3600,
    })
    expect(token).toBe('signed-token')
  })

  it('generateTokens: should return both tokens', async () => {
    jwtService.signAsync
      .mockResolvedValueOnce('access-token')
      .mockResolvedValueOnce('refresh-token')

    const result = await service.generateTokens({
      userId: '1',
      email: 'test@test.com',
    })

    expect(result.accessToken).toBe('access-token')
    expect(result.refreshToken).toBe('refresh-token')
  })

  it('verifyRefreshToken: should verify with refresh secret', async () => {
    const payload = { userId: '1', email: 'test@test.com' }
    jwtService.verifyAsync.mockResolvedValue(payload)
    const result = await service.verifyRefreshToken('token')

    expect(jwtService.verifyAsync).toHaveBeenCalledWith('token', {
      secret: 'refresh-secret',
    })
    expect(result).toEqual(payload)
  })

  it('accessTokenCookieOptions: should return httpOnly, sameSite lax, secure', () => {
    const options = service.accessTokenCookieOptions()

    expect(options.httpOnly).toBe(true)
    expect(options.sameSite).toBe('lax')
    expect(options.secure).toBe(true)
  })

  it('verifyAccessToken: should verify with access secret', async () => {
    const payload = { userId: '1', email: 'test@test.com' }
    jwtService.verifyAsync.mockResolvedValue(payload)
    const result = await service.verifyAccessToken('access-token')

    expect(jwtService.verifyAsync).toHaveBeenCalledWith('access-token', {
      secret: 'access-secret',
    })
    expect(result).toEqual(payload)
  })

  it('refreshTokenCookieOptions: should return httpOnly with maxAge from config', () => {
    const options = service.refreshTokenCookieOptions()

    expect(options.httpOnly).toBe(true)
    expect(options.sameSite).toBe('lax')
    expect(options.maxAge).toBe(604800000)
  })
})
