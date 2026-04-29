export type TransactionControllerFindAllType =
  (typeof TransactionControllerFindAllType)[keyof typeof TransactionControllerFindAllType]

export const TransactionControllerFindAllType = {
  income: 'income',
  expense: 'expense',
} as const
