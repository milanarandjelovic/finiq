import type { CreateTransactionPayloadDtoType } from './createTransactionPayloadDtoType'

export interface CreateTransactionPayloadDto {
  type: CreateTransactionPayloadDtoType
  amount: number
  date: string
  note?: string
  categoryId?: string
}
