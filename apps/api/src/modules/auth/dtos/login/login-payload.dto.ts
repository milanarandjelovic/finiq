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

export class LoginPayloadDto {
  @IsEmail({}, { message: 'Email field must be a valid email address.' })
  @IsNotEmpty({ message: 'Email should not be empty.' })
  @IsNotExist(
    { tableName: 'users', column: 'email' },
    {
      message: "This email isn't associated with an account.",
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
  @IsValidPassword({ column: 'email' }, { message: 'Password is not valid.' })
  @ApiProperty({
    required: true,
    minLength: GENERAL_VALIDATION_RULES.PASSWORD_MIN_LENGTH,
    maxLength: GENERAL_VALIDATION_RULES.PASSWORD_MAX_LENGTH,
    example: 'password',
  })
  password: string
}
