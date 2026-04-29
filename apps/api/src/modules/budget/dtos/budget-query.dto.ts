import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

import { PAGINATION_PAGE_LIMIT, PAGINATION_PAGE_START } from '@finiq/shared'

export class BudgetQueryDto {
  @IsInt()
  @Min(1)
  @Max(12)
  @Type(() => Number)
  @ApiProperty({ example: 4 })
  month: number

  @IsInt()
  @Min(2000)
  @Type(() => Number)
  @ApiProperty({ example: 2026 })
  year: number

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  categoryName: string

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @ApiProperty({
    example: PAGINATION_PAGE_START,
    default: PAGINATION_PAGE_START,
    required: false,
  })
  currentPage: number = PAGINATION_PAGE_START

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @ApiProperty({
    example: PAGINATION_PAGE_LIMIT,
    default: PAGINATION_PAGE_LIMIT,
    required: false,
  })
  perPage: number = PAGINATION_PAGE_LIMIT
}
