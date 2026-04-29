import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { EmailVerification } from '@/modules/auth/entities/email-verification.entity'
import { UserQueryBuilder } from '@/modules/user/builders/user-query.builder'
import { UserPasswordController } from '@/modules/user/controllers/user-password.controller'
import { UserProfileController } from '@/modules/user/controllers/user-profile.controller'
import { UserController } from '@/modules/user/controllers/user.controller'
import { User } from '@/modules/user/entities/user.entity'
import { UserPasswordService } from '@/modules/user/services/user-password.service'
import { UserProfileService } from '@/modules/user/services/user-profile.service'
import { UserService } from '@/modules/user/services/user.service'

@Module({
  imports: [TypeOrmModule.forFeature([User, EmailVerification])],
  controllers: [UserController, UserProfileController, UserPasswordController],
  providers: [
    UserService,
    UserProfileService,
    UserPasswordService,
    UserQueryBuilder,
  ],
  exports: [UserService, UserProfileService, UserPasswordService],
})
export class UserModule {}
