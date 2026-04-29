export type TransactionType =
  (typeof TransactionType)[keyof typeof TransactionType]

export const TransactionType = {
  income: 'income',
  expense: 'expense',
} as const
