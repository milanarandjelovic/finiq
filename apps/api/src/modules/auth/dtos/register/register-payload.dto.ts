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

export class RegisterPayloadDto {
  @IsNotEmpty({ message: 'Name should not be empty.' })
  @MinLength(GENERAL_VALIDATION_RULES.NAME_MIN_LENGTH, {
    message: 'Name must be at least 3 characters long.',
  })
  @MaxLength(GENERAL_VALIDATION_RULES.NAME_MAX_LENGTH, {
    message: 'Name must be at most 30 characters long.',
  })
  @Matches(new RegExp(GENERAL_VALIDATION_RULES.NAME_REGEX), {
    always: true,
    message: 'Name may only contain letter and white space.',
  })
  @NoInvalidSpaces()
  @ApiProperty({
    required: true,
    minLength: GENERAL_VALIDATION_RULES.NAME_MIN_LENGTH,
    maxLength: GENERAL_VALIDATION_RULES.NAME_MAX_LENGTH,
    example: 'John Doe',
  })
  name: string

  @IsEmail({}, { message: 'Email field must be a valid email address.' })
  @IsNotEmpty({ message: 'Email should not be empty.' })
  @IsUnique(
    { tableName: 'users', column: 'email' },
    {
      message: 'Email should not be empty.',
    },
  )
  @ApiProperty({
    required: true,
    example: 'john.doe@email.com',
  })
  email: string

  @IsNotEmpty({ message: 'Password should not be empty.' })
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
      message: 'Password must have one special character.',
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

  @IsNotEmpty({
    message: 'Password confirmation should not be empty.',
  })
  @MinLength(GENERAL_VALIDATION_RULES.PASSWORD_MIN_LENGTH, {
    message: 'Password confirmation must be at least 8 characters long.',
  })
  @MaxLength(GENERAL_VALIDATION_RULES.PASSWORD_MAX_LENGTH, {
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
