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

export class VerifyEmailPayloadDto {
  @IsString()
  @ApiProperty({
    example: 'fbdca5e8-3e1a-45fa-a316-6960492e460f',
  })
  token: string

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
  })
  passwordConfirmation: string
}
