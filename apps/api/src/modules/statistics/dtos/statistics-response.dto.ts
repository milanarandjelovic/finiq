import { ApiProperty } from '@nestjs/swagger'

export class SpendingByCategoryItemDto {
  @ApiProperty({ example: 'c9cb1462-2f57-414a-aead-39ca4405e010' })
  categoryId: string

  @ApiProperty({ example: 'Groceries' })
  name: string

  @ApiProperty({ example: '🛒' })
  emoji: string

  @ApiProperty({ example: '#FF5733' })
  color: string

  @ApiProperty({ example: 320.5 })
  amount: number

  @ApiProperty({ example: 21.37 })
  percentage: number
}

export class MonthlyTrendItemDto {
  @ApiProperty({ example: 4 })
  month: number

  @ApiProperty({ example: 2026 })
  year: number

  @ApiProperty({ example: 3000.0 })
  income: number

  @ApiProperty({ example: 1500.0 })
  expenses: number
}

export class StatisticsDataDto {
  @ApiProperty({ type: () => [SpendingByCategoryItemDto] })
  spendingByCategory: SpendingByCategoryItemDto[]

  @ApiProperty({ type: () => [MonthlyTrendItemDto] })
  monthlyTrend: MonthlyTrendItemDto[]
}

export class StatisticsResponseDto {
  @ApiProperty({ type: () => StatisticsDataDto })
  statistics: StatisticsDataDto
}
