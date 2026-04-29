import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ClsService } from 'nestjs-cls'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { Configuration } from '@/config/interfaces/configuration.interface'
import { JwtPayloadInterface } from '@/modules/auth/interfaces/jwt-payload.interface'
import { AuthService } from '@/modules/auth/services/auth.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
    private readonly clsService: ClsService,
  ) {
    const jwtConfig = configService.get<Configuration['jwt']>('jwt')

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secretOrKey,
    })
  }

  async validate(payload: JwtPayloadInterface) {
    const user = await this.authService.validateUser(payload)

    if (!user) {
      throw new UnauthorizedException()
    }

    this.clsService.set('userId', user.id)

    return user
  }
}
