import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, Max, Min } from 'class-validator'

export class DashboardQueryDto {
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
}
