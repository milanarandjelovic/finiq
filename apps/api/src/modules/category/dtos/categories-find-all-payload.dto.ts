import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

import { PAGINATION_PAGE_LIMIT, PAGINATION_PAGE_START } from '@finiq/shared'

export class CategoriesFindAllPayloadDto {
  @ApiPropertyOptional({ example: 0 })
  isGoal?: number

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'food' })
  name?: string

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
  @Max(100)
  @Type(() => Number)
  @ApiPropertyOptional({
    example: PAGINATION_PAGE_LIMIT,
    default: PAGINATION_PAGE_LIMIT,
  })
  perPage: number = PAGINATION_PAGE_LIMIT
}
