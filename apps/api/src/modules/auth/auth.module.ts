import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Configuration } from '@/config/interfaces/configuration.interface'
import { AuthController } from '@/modules/auth/controllers/auth.controller'
import { EmailVerification } from '@/modules/auth/entities/email-verification.entity'
import { PasswordReset } from '@/modules/auth/entities/password-reset.entity'
import { AuthService } from '@/modules/auth/services/auth.service'
import { JwtTokenService } from '@/modules/auth/services/jwt-token.service'
import { JwtRefreshTokenStrategy } from '@/modules/auth/strategies/jwt-refresh-token.strategy'
import { JwtStrategy } from '@/modules/auth/strategies/jwt.strategy'
import { User } from '@/modules/user/entities/user.entity'
import { IsNotExistConstraint } from '@/shared/validators/constraints/is-not-exist.constraint'
import { IsUniqueConstraint } from '@/shared/validators/constraints/is-unique.constraint'
import { IsUserVerifiedEmailConstraint } from '@/shared/validators/constraints/is-user-verified-email.constraint'
import { IsValidPasswordResetTokenConstraint } from '@/shared/validators/constraints/is-valid-password-reset-token.constraint'
import { IsValidPasswordConstraint } from '@/shared/validators/constraints/is-valid-password.constraint'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, EmailVerification, PasswordReset]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const jwtConfig = configService.get<Configuration['jwt']>('jwt')

        return {
          secret: jwtConfig.secretOrKey,
          signOptions: {
            expiresIn: jwtConfig.expiresIn,
          },
        }
      },
      inject: [ConfigService],
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtTokenService,
    JwtService,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    IsUniqueConstraint,
    IsNotExistConstraint,
    IsValidPasswordConstraint,
    IsUserVerifiedEmailConstraint,
    IsValidPasswordResetTokenConstraint,
  ],
  exports: [AuthService],
})
export class AuthModule {}
