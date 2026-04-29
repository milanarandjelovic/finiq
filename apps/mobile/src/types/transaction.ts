export type TransactionType = 'income' | 'expense'

export type Transaction = {
  id: string
  type: TransactionType
  amount: number
  date: string
  note?: string
  receiptPath?: string
  category?: {
    id: string
    name: string
    emoji: string
    color: string
  }
  createdAt: string
  updatedAt: string
}

export type TransactionsFindAllQuery = {
  year?: number
  month?: number
  type?: TransactionType
  categoryId?: string
  categoryName?: string
  currentPage?: number
  perPage?: number
}

export type CreateTransactionPayload = {
  type: TransactionType
  amount: number
  date: string
  note?: string
  categoryId?: string
}

export type TransactionResponse = {
  data: {
    transaction: Transaction
  }
}

export type TransactionsResponse = {
  data: {
    transactions: {
      data: Transaction[]
      meta: {
        pagination: {
          currentPage: number
          lastPage: number
          nextPage: number
          perPage: number
          previousPage: number
          total: number
        }
      }
    }
  }
}
