import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator'

import { GENERAL_VALIDATION_RULES } from '@finiq/shared'
import { IsMatch } from '@/shared/decorators/is-match.decorator'
import { NoInvalidSpaces } from '@/shared/decorators/no-invalid-spaces.decorator'
import { i18nMsg } from '@/shared/helpers/i18n-msg.helper'

export class UserPayloadDto {
  @IsString()
  @IsNotEmpty({ message: i18nMsg('validation.nameNotEmpty') })
  @MinLength(GENERAL_VALIDATION_RULES.NAME_MIN_LENGTH, {
    always: true,
    message: i18nMsg('validation.nameMinLength'),
  })
  @MaxLength(GENERAL_VALIDATION_RULES.NAME_MAX_LENGTH, {
    always: true,
    message: i18nMsg('validation.nameMaxLength'),
  })
  @Matches(GENERAL_VALIDATION_RULES.NAME_REGEX, {
    message: i18nMsg('validation.nameNotValid'),
  })
  @NoInvalidSpaces()
  @ApiProperty({
    required: true,
    example: 'John Doe',
    minLength: GENERAL_VALIDATION_RULES.NAME_MIN_LENGTH,
    maxLength: GENERAL_VALIDATION_RULES.NAME_MAX_LENGTH,
  })
  name: string

  @IsEmail({}, { message: i18nMsg('validation.emailValid') })
  @IsNotEmpty({ message: i18nMsg('validation.emailNotEmpty') })
  @ApiProperty({
    required: true,
    example: 'john.doe@email.com',
  })
  email: string

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    default: false,
    description:
      'When true, creates user without a password and sends an activation email',
  })
  sendActivationEmail?: boolean

  @ValidateIf((o) => !o.sendActivationEmail)
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
    required: false,
    minLength: GENERAL_VALIDATION_RULES.PASSWORD_MIN_LENGTH,
    maxLength: GENERAL_VALIDATION_RULES.PASSWORD_MAX_LENGTH,
    example: 'password',
  })
  password?: string

  @ValidateIf((o) => !o.sendActivationEmail)
  @IsNotEmpty({ message: i18nMsg('validation.passwordConfirmationNotEmpty') })
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
  passwordConfirmation?: string
}
