import { ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsBoolean,
  IsDateString,
  IsHexColor,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator'

export class UpdateCategoryPayloadDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'Groceries' })
  name?: string

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '🛒' })
  emoji?: string

  @IsHexColor()
  @IsOptional()
  @ApiPropertyOptional({ example: '#FF5733' })
  color?: string

  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiPropertyOptional({ example: 500.0 })
  budgetAmount?: number

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ example: false })
  isGoal?: boolean

  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiPropertyOptional({ example: 10000.0 })
  targetAmount?: number

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({ example: '2026-12-31' })
  targetDate?: string

  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiPropertyOptional({ example: 0 })
  sortOrder?: number
}
