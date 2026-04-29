'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { useMonthNavigation } from '@finiq/hooks'
import { MonthPicker } from '@finiq/ui/components/month-picker'
import {
  getCategoryControllerFindAllQueryKey,
  useCategoryControllerFindAll,
} from '@/api/__generated__/categories/categories'
import { getDashboardControllerGetDashboardQueryKey } from '@/api/__generated__/dashboard/dashboard'
import type {
  Category,
  CategoryControllerFindAll200,
} from '@/api/__generated__/models'
import {
  getTransactionControllerFindAllQueryKey,
  useTransactionControllerDelete,
} from '@/api/__generated__/transactions/transactions'
import { AddTransactionDialog } from '@/app/(dashboard)/dashboard/transactions/_components/dialog/add-transaction-dialog'
import { DeleteTransactionDialog } from '@/app/(dashboard)/dashboard/transactions/_components/dialog/delete-transaction-dialog'
import { TransactionsTable } from '@/app/(dashboard)/dashboard/transactions/_components/table/transactions-table'
import { crudMutationOptions } from '@/lib/mutation'

export default function TransactionsPage() {
  const { year, month, date, setDate } = useMonthNavigation()
  const [open, setOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const qc = useQueryClient()

  const { data: categoriesResult } = useCategoryControllerFindAll(undefined, {
    query: { queryKey: getCategoryControllerFindAllQueryKey() },
  })
  const categories =
    (categoriesResult?.data as CategoryControllerFindAll200 | undefined)?.data
      ?.categories?.data ?? []

  const transactionQueryKeys = [
    getTransactionControllerFindAllQueryKey(),
    getDashboardControllerGetDashboardQueryKey(),
  ]

  const { mutateAsync: deleteTransaction } = useTransactionControllerDelete(
    crudMutationOptions(qc, {
      queryKeys: transactionQueryKeys,
      successMessage: 'Transaction deleted',
      errorMessage: 'Failed to delete transaction',
    }),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground text-sm">
            Track and manage your income and expenses.
          </p>
        </div>

        <AddTransactionDialog
          open={open}
          onOpenChange={setOpen}
          categories={categories as Category[]}
          onSuccess={() => {
            transactionQueryKeys.forEach((queryKey) =>
              qc.invalidateQueries({ queryKey }),
            )
            setOpen(false)
          }}
        />
      </div>

      <MonthPicker value={date} onChange={setDate} />

      <TransactionsTable year={year} month={month} onDelete={setDeleteId} />

      <DeleteTransactionDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        onConfirm={async () => {
          if (deleteId) {
            await deleteTransaction({ id: deleteId })
          }
        }}
      />
    </div>
  )
}
