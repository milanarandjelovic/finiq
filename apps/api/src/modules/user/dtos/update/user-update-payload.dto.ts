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

export class UserUpdatePayloadDto extends PickType(UserPayloadDto, [
  'name',
  'email',
] as const) {
  @IsOptional()
  @ValidateIf((_object, value) => value !== '')
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
  password: string

  @IsOptional()
  @ValidateIf((_object, value) => value !== '')
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
    required: false,
    minLength: GENERAL_VALIDATION_RULES.PASSWORD_MIN_LENGTH,
    maxLength: GENERAL_VALIDATION_RULES.PASSWORD_MAX_LENGTH,
    example: 'password',
  })
  passwordConfirmation: string
}
