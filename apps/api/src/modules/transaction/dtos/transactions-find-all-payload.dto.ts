import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator'

import {
  PAGINATION_PAGE_LIMIT,
  PAGINATION_PAGE_START,
  TransactionType,
} from '@finiq/shared'

export class TransactionsFindAllPayloadDto {
  @IsInt()
  @Min(1)
  @Max(12)
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({ example: 4 })
  month?: number

  @IsInt()
  @Min(2000)
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({ example: 2026 })
  year?: number

  @IsEnum(TransactionType)
  @IsOptional()
  @ApiPropertyOptional({ enum: TransactionType })
  type?: TransactionType

  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional({ example: 'c9cb1462-2f57-414a-aead-39ca4405e010' })
  categoryId?: string

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'food' })
  categoryName?: string

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @ApiPropertyOptional({
    example: PAGINATION_PAGE_START,
    default: PAGINATION_PAGE_START,
  })
  currentPage: number = PAGINATION_PAGE_START

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @ApiPropertyOptional({
    example: PAGINATION_PAGE_LIMIT,
    default: PAGINATION_PAGE_LIMIT,
  })
  perPage: number = PAGINATION_PAGE_LIMIT
}
