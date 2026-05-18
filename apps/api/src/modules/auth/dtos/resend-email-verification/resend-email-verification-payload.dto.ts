import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

import { IsNotExist } from '@/shared/decorators/is-not-exist.decorator'
import { IsUserVerifiedEmail } from '@/shared/decorators/is-user-verified-email.decorator'
import { i18nMsg } from '@/shared/helpers/i18n-msg.helper'

export class ResendEmailVerificationPayloadDto {
  @IsEmail({}, { message: i18nMsg('validation.emailValid') })
  @IsNotEmpty({
    always: true,
    message: i18nMsg('validation.emailNotEmpty'),
  })
  @IsNotExist(
    { tableName: 'users', column: 'email' },
    { message: i18nMsg('validation.emailNotAssociated') },
  )
  @IsUserVerifiedEmail(
    { column: 'email' },
    { message: i18nMsg('validation.emailAlreadyVerified') },
  )
  @ApiProperty({
    required: true,
    example: 'john@doe.com',
  })
  email: string
}
