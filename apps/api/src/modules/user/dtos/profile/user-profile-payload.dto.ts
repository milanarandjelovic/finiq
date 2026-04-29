import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator'

import { GENERAL_VALIDATION_RULES } from '@finiq/shared'

export class UserProfilePayloadDto {
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
  @ApiProperty({
    required: true,
    minLength: GENERAL_VALIDATION_RULES.NAME_MIN_LENGTH,
    maxLength: GENERAL_VALIDATION_RULES.NAME_MAX_LENGTH,
    example: 'John Doe',
  })
  name: string
}
