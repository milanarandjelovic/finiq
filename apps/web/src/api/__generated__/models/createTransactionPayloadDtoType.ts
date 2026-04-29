export type CreateTransactionPayloadDtoType =
  (typeof CreateTransactionPayloadDtoType)[keyof typeof CreateTransactionPayloadDtoType]

export const CreateTransactionPayloadDtoType = {
  income: 'income',
  expense: 'expense',
} as const
