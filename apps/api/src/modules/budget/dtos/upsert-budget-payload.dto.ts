import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsNumber, IsUUID, Max, Min } from 'class-validator'

export class UpsertBudgetPayloadDto {
  @IsUUID()
  @ApiProperty({ example: 'c9cb1462-2f57-414a-aead-39ca4405e010' })
  categoryId: string

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

  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 500.0 })
  amount: number
}
