'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { type Table } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { Button } from '@finiq/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@finiq/ui/components/dialog'
import { getDashboardControllerGetDashboardQueryKey } from '@/api/__generated__/dashboard/dashboard'
import {
  getTransactionControllerFindAllQueryKey,
  useTransactionControllerDelete,
} from '@/api/__generated__/transactions/transactions'
import type { TransactionRow } from '@/app/(dashboard)/dashboard/transactions/_components/table/transactions-table-columns'

interface TransactionsTableToolbarActionsProps {
  table: Table<TransactionRow>
}

export function TransactionsTableToolbarActions({
  table,
}: TransactionsTableToolbarActionsProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const qc = useQueryClient()

  const { mutateAsync: deleteTransaction, isPending } =
    useTransactionControllerDelete({
      mutation: {
        onError: () => toast.error(t('transactions.failedToDeleteMultiple')),
      },
    })

  const selected = table
    .getFilteredSelectedRowModel()
    .rows.map((r) => r.original)

  if (selected.length === 0) {
    return null
  }

  async function handleDelete() {
    await Promise.all(selected.map((t) => deleteTransaction({ id: t.id })))
    await Promise.all([
      qc.invalidateQueries({
        queryKey: getTransactionControllerFindAllQueryKey(),
      }),
      qc.invalidateQueries({
        queryKey: getDashboardControllerGetDashboardQueryKey(),
      }),
    ])
    toast.success(
      selected.length === 1
        ? t('transactions.transactionDeleted')
        : t('transactions.transactionsDeleted', { count: selected.length }),
    )
    table.resetRowSelection()
    setOpen(false)
  }

  return (
    <>
      <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
        <Trash2 className="mr-1.5 size-4" />
        {t('transactions.deleteCount', { count: selected.length })}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selected.length === 1
                ? t('transactions.deleteTransaction')
                : t('transactions.deleteTransactions')}
            </DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm">
            {selected.length === 1
              ? t('transactions.deleteTransactionConfirm')
              : t('transactions.deleteTransactionsConfirm', {
                  count: selected.length,
                })}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t('general.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? t('general.deleting') : t('general.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
