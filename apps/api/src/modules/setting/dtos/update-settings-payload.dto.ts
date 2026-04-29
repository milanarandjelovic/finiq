import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsIn, IsOptional, IsString } from 'class-validator'

import { CURRENCY_VALUES } from '@finiq/shared'

export class UpdateSettingsPayloadDto {
  @IsString()
  @IsIn(CURRENCY_VALUES)
  @IsOptional()
  @ApiPropertyOptional({ enum: CURRENCY_VALUES, example: 'USD' })
  currency?: string
}
