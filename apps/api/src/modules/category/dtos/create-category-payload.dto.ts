import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsBoolean,
  IsDateString,
  IsHexColor,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator'

export class CreateCategoryPayloadDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Groceries' })
  name: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '🛒' })
  emoji: string

  @IsHexColor()
  @ApiProperty({ example: '#FF5733' })
  color: string

  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiPropertyOptional({ example: 500.0, default: 0 })
  budgetAmount?: number

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ example: false, default: false })
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
  @ApiPropertyOptional({ example: 0, default: 0 })
  sortOrder?: number
}
