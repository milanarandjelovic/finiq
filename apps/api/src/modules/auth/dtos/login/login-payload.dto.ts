import { ApiProperty } from '@nestjs/swagger'
import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator'

import { GENERAL_VALIDATION_RULES } from '@finiq/shared'
import { IsNotExist } from '@/shared/decorators/is-not-exist.decorator'
import { IsValidPassword } from '@/shared/decorators/is-valid-password.decorator'
import { i18nMsg } from '@/shared/helpers/i18n-msg.helper'

export class LoginPayloadDto {
  @IsEmail({}, { message: i18nMsg('validation.emailValid') })
  @IsNotEmpty({ message: i18nMsg('validation.emailNotEmpty') })
  @IsNotExist(
    { tableName: 'users', column: 'email' },
    { message: i18nMsg('validation.emailNotAssociated') },
  )
  @ApiProperty({
    required: true,
    example: 'john.doe@email.com',
  })
  email: string

  @IsNotEmpty({ message: i18nMsg('validation.passwordNotEmpty') })
  @MinLength(GENERAL_VALIDATION_RULES.PASSWORD_MIN_LENGTH, {
    always: true,
    message: i18nMsg('validation.passwordMinLength'),
  })
  @MaxLength(GENERAL_VALIDATION_RULES.PASSWORD_MAX_LENGTH, {
    always: true,
    message: i18nMsg('validation.passwordMaxLength'),
  })
  @Matches(new RegExp(GENERAL_VALIDATION_RULES.PASSWORD_REGEX_LOWERCASE), {
    always: true,
    message: i18nMsg('validation.passwordRegexLowercase'),
  })
  @Matches(new RegExp(GENERAL_VALIDATION_RULES.PASSWORD_REGEX_UPPERCASE), {
    always: true,
    message: i18nMsg('validation.passwordRegexUppercase'),
  })
  @Matches(
    new RegExp(GENERAL_VALIDATION_RULES.PASSWORD_REGEX_SPECIAL_CHARACTERS),
    {
      always: true,
      message: i18nMsg('validation.passwordRegexSpecialCharacters'),
    },
  )
  @Matches(new RegExp(GENERAL_VALIDATION_RULES.PASSWORD_REGEX_NUMBER), {
    always: true,
    message: i18nMsg('validation.passwordRegexNumber'),
  })
  @IsValidPassword(
    { column: 'email' },
    { message: i18nMsg('validation.passwordNotValid') },
  )
  @ApiProperty({
    required: true,
    minLength: GENERAL_VALIDATION_RULES.PASSWORD_MIN_LENGTH,
    maxLength: GENERAL_VALIDATION_RULES.PASSWORD_MAX_LENGTH,
    example: 'password',
  })
  password: string
}
