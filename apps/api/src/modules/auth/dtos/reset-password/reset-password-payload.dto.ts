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
import { IsNotExist } from '@/shared/decorators/is-not-exist.decorator'
import { IsValidPasswordResetToken } from '@/shared/decorators/is-valid-password-reset-token.decorator'

export class ResetPasswordPayloadDto {
  @IsNotExist(
    { tableName: 'password_resets', column: 'token' },
    { message: 'Reset password token is not valid.' },
  )
  @IsValidPasswordResetToken(
    { column: 'email' },
    { message: 'Reset password token is not valid.' },
  )
  @ApiProperty({
    example: '6b33c97d-e2cd-4fe3-af61-bd59850fb26f',
  })
  token: string

  @IsEmail({}, { message: 'Email field must be a valid email address.' })
  @IsNotEmpty({
    always: true,
    message: 'Email should not be empty.',
  })
  @IsNotExist(
    { tableName: 'users', column: 'email' },
    {
      message: "This email isn't associated with an account.",
    },
  )
  @ApiProperty({
    required: true,
    example: 'john@doe.com',
  })
  email: string

  @IsNotEmpty()
  @MinLength(GENERAL_VALIDATION_RULES.PASSWORD_MIN_LENGTH, {
    always: true,
    message: 'Password must be at least 8 characters long.',
  })
  @MaxLength(GENERAL_VALIDATION_RULES.PASSWORD_MAX_LENGTH, {
    always: true,
    message: 'Password must be at most 30 characters long.',
  })
  @Matches(new RegExp(GENERAL_VALIDATION_RULES.PASSWORD_REGEX_LOWERCASE), {
    always: true,
    message: 'Password must have one lowercase character.',
  })
  @Matches(new RegExp(GENERAL_VALIDATION_RULES.PASSWORD_REGEX_UPPERCASE), {
    always: true,
    message: 'Password must have one uppercase character.',
  })
  @Matches(
    new RegExp(GENERAL_VALIDATION_RULES.PASSWORD_REGEX_SPECIAL_CHARACTERS),
    {
      always: true,
      message: 'Password must have one number.',
    },
  )
  @Matches(new RegExp(GENERAL_VALIDATION_RULES.PASSWORD_REGEX_NUMBER), {
    always: true,
    message: 'Password must have one number.',
  })
  @ApiProperty({
    required: true,
    minLength: GENERAL_VALIDATION_RULES.PASSWORD_MIN_LENGTH,
    maxLength: GENERAL_VALIDATION_RULES.PASSWORD_MAX_LENGTH,
    example: 'password',
  })
  password: string

  @IsNotEmpty()
  @MinLength(GENERAL_VALIDATION_RULES.PASSWORD_MIN_LENGTH, {
    always: true,
    message: 'Password confirmation must be at least 8 characters long.',
  })
  @MaxLength(GENERAL_VALIDATION_RULES.PASSWORD_MAX_LENGTH, {
    always: true,
    message: 'Password confirmation must be at most 30 characters long.',
  })
  @Matches(new RegExp(GENERAL_VALIDATION_RULES.PASSWORD_REGEX_LOWERCASE), {
    always: true,
    message: 'Password confirmation must have one lowercase character.',
  })
  @Matches(new RegExp(GENERAL_VALIDATION_RULES.PASSWORD_REGEX_UPPERCASE), {
    always: true,
    message: 'Password confirmation must have one uppercase character.',
  })
  @Matches(
    new RegExp(GENERAL_VALIDATION_RULES.PASSWORD_REGEX_SPECIAL_CHARACTERS),
    {
      always: true,
      message: 'Password confirmation must have one special character.',
    },
  )
  @Matches(new RegExp(GENERAL_VALIDATION_RULES.PASSWORD_REGEX_NUMBER), {
    always: true,
    message: 'Password confirmation must have one number.',
  })
  @IsMatch(
    { field: 'password' },
    {
      always: true,
      message: 'Password and password confirmation must match.',
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
