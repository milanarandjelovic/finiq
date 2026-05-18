import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator'

import { GENERAL_VALIDATION_RULES } from '@finiq/shared'
import { i18nMsg } from '@/shared/helpers/i18n-msg.helper'

export class UserProfilePayloadDto {
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
  @ApiProperty({
    required: true,
    minLength: GENERAL_VALIDATION_RULES.NAME_MIN_LENGTH,
    maxLength: GENERAL_VALIDATION_RULES.NAME_MAX_LENGTH,
    example: 'John Doe',
  })
  name: string
}
