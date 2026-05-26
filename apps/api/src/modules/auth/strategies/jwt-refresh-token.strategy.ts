import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import type { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { Configuration } from '@/config/interfaces/configuration.interface'
import { JwtTokenService } from '@/modules/auth/services/jwt-token.service'

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    configService: ConfigService,
    private readonly jwtTokenService: JwtTokenService,
  ) {
    const jwtConfig = configService.get<Configuration['jwt']>('jwt')

    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: jwtConfig.refreshSecret,
      passReqToCallback: true,
    })
  }

  async validate(request: Request, payload: any) {
    const refreshToken = request?.body?.refreshToken

    if (!refreshToken) {
      throw new UnauthorizedException()
    }

    const verifyRefreshToken =
      await this.jwtTokenService.verifyRefreshToken(refreshToken)

    if (!verifyRefreshToken) {
      throw new UnauthorizedException()
    }

    return {
      ...payload,
      verifyRefreshToken,
    }
  }
}
