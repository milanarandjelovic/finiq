import { ApiProperty } from '@nestjs/swagger'

import { Budget } from '@/modules/budget/entities/budget.entity'
import {
  PaginationDto,
  PaginationMetadataDto,
} from '@/shared/dtos/pagination-metadata.dto'

export class BudgetResponseDto {
  @ApiProperty({ type: () => Budget })
  budget: Budget
}

export class BudgetsWithPaginationResponseDto {
  @ApiProperty({ type: () => [Budget] })
  data: Budget[]

  @ApiProperty({ type: PaginationDto })
  meta: { pagination: PaginationMetadataDto }
}

export class BudgetsResponseDto {
  @ApiProperty({ type: () => BudgetsWithPaginationResponseDto })
  budgets: BudgetsWithPaginationResponseDto
}

export class BudgetsCopiedResponseDto {
  @ApiProperty({ type: () => BudgetsWithPaginationResponseDto })
  budgets: BudgetsWithPaginationResponseDto
}
