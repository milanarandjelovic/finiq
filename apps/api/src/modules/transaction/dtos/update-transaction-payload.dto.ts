import { ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator'

export class UpdateTransactionPayloadDto {
  @IsNumber()
  @Min(0.01)
  @IsOptional()
  @ApiPropertyOptional({ example: 49.99 })
  amount?: number

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({ example: '2026-04-18' })
  date?: string

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'Weekly grocery run' })
  note?: string

  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional({ example: 'c9cb1462-2f57-414a-aead-39ca4405e010' })
  categoryId?: string
}
