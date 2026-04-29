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

export class UserPayloadDto {
  @IsString()
  @IsNotEmpty({ message: 'Name should not be empty.' })
  @MinLength(GENERAL_VALIDATION_RULES.NAME_MIN_LENGTH, {
    always: true,
    message: 'Name must be at least 3 characters long.',
  })
  @MaxLength(GENERAL_VALIDATION_RULES.NAME_MAX_LENGTH, {
    always: true,
    message: 'Name must be at most 30 characters long.',
  })
  @Matches(GENERAL_VALIDATION_RULES.NAME_REGEX, {
    message: 'Name must only contain letters and spaces.',
  })
  @NoInvalidSpaces()
  @ApiProperty({
    required: true,
    example: 'John Doe',
    minLength: GENERAL_VALIDATION_RULES.NAME_MIN_LENGTH,
    maxLength: GENERAL_VALIDATION_RULES.NAME_MAX_LENGTH,
  })
  name: string

  @IsEmail({}, { message: 'Email field must be a valid email address.' })
  @IsNotEmpty({ message: 'Email should not be empty.' })
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
    required: false,
    minLength: GENERAL_VALIDATION_RULES.PASSWORD_MIN_LENGTH,
    maxLength: GENERAL_VALIDATION_RULES.PASSWORD_MAX_LENGTH,
    example: 'password',
  })
  password?: string

  @ValidateIf((o) => !o.sendActivationEmail)
  @IsNotEmpty({
    message: 'Password should not be empty.',
  })
  @MinLength(GENERAL_VALIDATION_RULES.PASSWORD_MIN_LENGTH, {
    message: 'Password must be at least 8 characters long.',
  })
  @MaxLength(GENERAL_VALIDATION_RULES.PASSWORD_MAX_LENGTH, {
    message: 'Password must be at most 30 characters long.',
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
    required: false,
    minLength: GENERAL_VALIDATION_RULES.PASSWORD_MIN_LENGTH,
    maxLength: GENERAL_VALIDATION_RULES.PASSWORD_MAX_LENGTH,
    example: 'password',
  })
  passwordConfirmation?: string
}
