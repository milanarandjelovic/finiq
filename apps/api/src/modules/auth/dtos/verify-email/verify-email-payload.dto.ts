import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator'

import { GENERAL_VALIDATION_RULES } from '@finiq/shared'
import { IsMatch } from '@/shared/decorators/is-match.decorator'
import { i18nMsg } from '@/shared/helpers/i18n-msg.helper'

export class VerifyEmailPayloadDto {
  @IsString()
  @ApiProperty({
    example: 'fbdca5e8-3e1a-45fa-a316-6960492e460f',
  })
  token: string

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
  @ApiProperty({
    required: true,
    minLength: GENERAL_VALIDATION_RULES.PASSWORD_MIN_LENGTH,
    maxLength: GENERAL_VALIDATION_RULES.PASSWORD_MAX_LENGTH,
  })
  password: string

  @IsNotEmpty({ message: i18nMsg('validation.passwordConfirmationNotEmpty') })
  @MinLength(GENERAL_VALIDATION_RULES.PASSWORD_MIN_LENGTH, {
    always: true,
    message: i18nMsg('validation.passwordConfirmationMinLength'),
  })
  @MaxLength(GENERAL_VALIDATION_RULES.PASSWORD_MAX_LENGTH, {
    always: true,
    message: i18nMsg('validation.passwordConfirmationMaxLength'),
  })
  @Matches(new RegExp(GENERAL_VALIDATION_RULES.PASSWORD_REGEX_LOWERCASE), {
    always: true,
    message: i18nMsg('validation.passwordConfirmationRegexLowercase'),
  })
  @Matches(new RegExp(GENERAL_VALIDATION_RULES.PASSWORD_REGEX_UPPERCASE), {
    always: true,
    message: i18nMsg('validation.passwordConfirmationRegexUppercase'),
  })
  @Matches(
    new RegExp(GENERAL_VALIDATION_RULES.PASSWORD_REGEX_SPECIAL_CHARACTERS),
    {
      always: true,
      message: i18nMsg('validation.passwordConfirmationRegexSpecialCharacters'),
    },
  )
  @Matches(new RegExp(GENERAL_VALIDATION_RULES.PASSWORD_REGEX_NUMBER), {
    always: true,
    message: i18nMsg('validation.passwordConfirmationRegexNumber'),
  })
  @IsMatch(
    { field: 'password' },
    {
      always: true,
      message: i18nMsg('validation.passwordConfirmationMustMatch'),
    },
  )
  @ApiProperty({
    required: true,
    minLength: GENERAL_VALIDATION_RULES.PASSWORD_MIN_LENGTH,
    maxLength: GENERAL_VALIDATION_RULES.PASSWORD_MAX_LENGTH,
  })
  passwordConfirmation: string
}
