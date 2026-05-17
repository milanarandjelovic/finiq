import { ApiProperty, PickType } from '@nestjs/swagger'
import {
  IsOptional,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator'

import { GENERAL_VALIDATION_RULES } from '@finiq/shared'
import { UserPayloadDto } from '@/modules/user/dtos/user-payload.dto'
import { IsMatch } from '@/shared/decorators/is-match.decorator'
import { i18nMsg } from '@/shared/helpers/i18n-msg.helper'

export class UserUpdatePayloadDto extends PickType(UserPayloadDto, [
  'name',
  'email',
] as const) {
  @IsOptional()
  @ValidateIf((_object, value) => value !== '')
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
    required: false,
    minLength: GENERAL_VALIDATION_RULES.PASSWORD_MIN_LENGTH,
    maxLength: GENERAL_VALIDATION_RULES.PASSWORD_MAX_LENGTH,
    example: 'password',
  })
  password: string

  @IsOptional()
  @ValidateIf((_object, value) => value !== '')
  @MinLength(GENERAL_VALIDATION_RULES.PASSWORD_MIN_LENGTH, {
    message: i18nMsg('validation.passwordConfirmationMinLength'),
  })
  @MaxLength(GENERAL_VALIDATION_RULES.PASSWORD_MAX_LENGTH, {
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
    { message: i18nMsg('validation.passwordConfirmationMustMatch') },
  )
  @ApiProperty({
    required: false,
    minLength: GENERAL_VALIDATION_RULES.PASSWORD_MIN_LENGTH,
    maxLength: GENERAL_VALIDATION_RULES.PASSWORD_MAX_LENGTH,
    example: 'password',
  })
  passwordConfirmation: string
}
