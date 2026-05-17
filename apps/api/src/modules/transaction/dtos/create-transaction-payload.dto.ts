import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateIf,
} from 'class-validator'

import { TransactionType } from '@finiq/shared'
import { i18nMsg } from '@/shared/helpers/i18n-msg.helper'

export class CreateTransactionPayloadDto {
  @IsEnum(TransactionType)
  @ApiProperty({ enum: TransactionType, example: TransactionType.EXPENSE })
  type: TransactionType

  @IsNumber()
  @Min(0.01)
  @ApiProperty({ example: 49.99 })
  amount: number

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ example: '2026-04-18' })
  date: string

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'Weekly grocery run' })
  note?: string

  @IsUUID()
  @ValidateIf((o) => o.type === TransactionType.EXPENSE)
  @IsNotEmpty({ message: i18nMsg('validation.categoryRequiredForExpense') })
  @IsOptional()
  @ApiPropertyOptional({ example: 'c9cb1462-2f57-414a-aead-39ca4405e010' })
  categoryId?: string
}
