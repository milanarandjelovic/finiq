import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { CookieOptions } from 'express'

import { Configuration } from '@/config/interfaces/configuration.interface'
import { JwtPayloadInterface } from '@/modules/auth/interfaces/jwt-payload.interface'

@Injectable()
export class JwtTokenService {
  protected jwtConfig: Configuration['jwt']

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtConfig = this.configService.get<Configuration['jwt']>('jwt')
  }

  async generateAccessToken(payload: JwtPayloadInterface): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      algorithm: 'HS256',
      secret: this.jwtConfig.secretOrKey,
      expiresIn: this.jwtConfig.expiresIn / 1000, // This needs to be in seconds because expiresIn is in milliseconds
    })
  }

  async generateRefreshAccessToken(
    payload: JwtPayloadInterface,
  ): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      algorithm: 'HS256',
      secret: this.jwtConfig.refreshSecret,
      expiresIn: this.jwtConfig.refreshExpiresIn / 1000, // This needs to be in seconds because refreshExpiresIn is in milliseconds
    })
  }

  async generateTokens(
    payload: JwtPayloadInterface,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshAccessToken(payload),
    ])

    return {
      accessToken,
      refreshToken,
    }
  }

  async verifyAccessToken(token: string): Promise<JwtPayloadInterface> {
    return await this.jwtService.verifyAsync(token, {
      secret: this.jwtConfig.secretOrKey,
    })
  }

  async verifyRefreshToken(token: string): Promise<JwtPayloadInterface> {
    return await this.jwtService.verifyAsync(token, {
      secret: this.jwtConfig.refreshSecret,
    })
  }

  accessTokenCookieOptions(): CookieOptions {
    return {
      // expires: new Date(Date.now() + this.jwtConfig.expiresIn),
      maxAge: this.jwtConfig.expiresIn,
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
    }
  }

  refreshTokenCookieOptions(): CookieOptions {
    return {
      // expires: new Date(Date.now() + this.jwtConfig.refreshExpiresIn),
      maxAge: this.jwtConfig.refreshExpiresIn,
      httpOnly: true,
      sameSite: 'lax',
    }
  }
}
