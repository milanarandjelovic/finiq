import { ApiProperty } from '@nestjs/swagger'
import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator'

import { GENERAL_VALIDATION_RULES } from '@finiq/shared'
import { IsMatch } from '@/shared/decorators/is-match.decorator'
import { IsUnique } from '@/shared/decorators/is-unique.decorator'
import { NoInvalidSpaces } from '@/shared/decorators/no-invalid-spaces.decorator'
import { i18nMsg } from '@/shared/helpers/i18n-msg.helper'

export class RegisterPayloadDto {
  @IsNotEmpty({ message: i18nMsg('validation.nameNotEmpty') })
  @MinLength(GENERAL_VALIDATION_RULES.NAME_MIN_LENGTH, {
    message: i18nMsg('validation.nameMinLength'),
  })
  @MaxLength(GENERAL_VALIDATION_RULES.NAME_MAX_LENGTH, {
    message: i18nMsg('validation.nameMaxLength'),
  })
  @Matches(new RegExp(GENERAL_VALIDATION_RULES.NAME_REGEX), {
    always: true,
    message: i18nMsg('validation.nameNotValid'),
  })
  @NoInvalidSpaces()
  @ApiProperty({
    required: true,
    minLength: GENERAL_VALIDATION_RULES.NAME_MIN_LENGTH,
    maxLength: GENERAL_VALIDATION_RULES.NAME_MAX_LENGTH,
    example: 'John Doe',
  })
  name: string

  @IsEmail({}, { message: i18nMsg('validation.emailValid') })
  @IsNotEmpty({ message: i18nMsg('validation.emailNotEmpty') })
  @IsUnique(
    { tableName: 'users', column: 'email' },
    { message: i18nMsg('validation.emailAlreadyTaken') },
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
  @ApiProperty({
    required: true,
    minLength: GENERAL_VALIDATION_RULES.PASSWORD_MIN_LENGTH,
    maxLength: GENERAL_VALIDATION_RULES.PASSWORD_MAX_LENGTH,
    example: 'password',
  })
  password: string

  @IsNotEmpty({
    message: i18nMsg('validation.passwordConfirmationNotEmpty'),
  })
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
    {
      message: i18nMsg('validation.passwordConfirmationMustMatch'),
    },
  )
  @ApiProperty({
    required: true,
    minLength: GENERAL_VALIDATION_RULES.PASSWORD_MIN_LENGTH,
    maxLength: GENERAL_VALIDATION_RULES.PASSWORD_MAX_LENGTH,
    example: 'password',
  })
  passwordConfirmation: string
}
