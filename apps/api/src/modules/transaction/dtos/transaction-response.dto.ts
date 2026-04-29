import { ApiProperty } from '@nestjs/swagger'

import { Transaction } from '@/modules/transaction/entities/transaction.entity'
import {
  PaginationDto,
  PaginationMetadataDto,
} from '@/shared/dtos/pagination-metadata.dto'

export class TransactionResponseDto {
  @ApiProperty({ type: () => Transaction })
  transaction: Transaction
}

export class TransactionsWithPaginationResponseDto {
  @ApiProperty({ type: () => [Transaction] })
  data: Transaction[]

  @ApiProperty({ type: PaginationDto })
  meta: { pagination: PaginationMetadataDto }
}

export class TransactionsResponseDto {
  @ApiProperty({ type: () => TransactionsWithPaginationResponseDto })
  transactions: TransactionsWithPaginationResponseDto
}
