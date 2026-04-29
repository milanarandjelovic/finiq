import { ApiProperty } from '@nestjs/swagger'

export class CategoryBreakdownItemDto {
  @ApiProperty({ example: 'c9cb1462-2f57-414a-aead-39ca4405e010' })
  categoryId: string

  @ApiProperty({ example: 'Groceries' })
  name: string

  @ApiProperty({ example: '🛒' })
  emoji: string

  @ApiProperty({ example: '#FF5733' })
  color: string

  @ApiProperty({ example: 500.0 })
  budgeted: number

  @ApiProperty({ example: 320.5 })
  spent: number

  @ApiProperty({ example: 179.5 })
  available: number
}

export class DashboardDataDto {
  @ApiProperty({ example: 3000.0 })
  totalIncome: number

  @ApiProperty({ example: 1500.0 })
  totalExpenses: number

  @ApiProperty({ example: 1500.0 })
  balance: number

  @ApiProperty({
    example: 300.0,
    description: 'Income minus all budget allocations',
  })
  readyToAssign: number

  @ApiProperty({ type: () => [CategoryBreakdownItemDto] })
  categoryBreakdown: CategoryBreakdownItemDto[]
}

export class DashboardResponseDto {
  @ApiProperty({ type: () => DashboardDataDto })
  dashboard: DashboardDataDto
}
