'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { type Table } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
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
  const [open, setOpen] = useState(false)
  const qc = useQueryClient()

  const { mutateAsync: deleteTransaction, isPending } =
    useTransactionControllerDelete({
      mutation: {
        onError: () => toast.error('Failed to delete transactions'),
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
        ? 'Transaction deleted'
        : `${selected.length} transactions deleted`,
    )
    table.resetRowSelection()
    setOpen(false)
  }

  return (
    <>
      <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
        <Trash2 className="mr-1.5 size-4" />
        Delete ({selected.length})
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Delete {selected.length === 1 ? 'transaction' : 'transactions'}
            </DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm">
            Are you sure you want to delete{' '}
            {selected.length === 1 ? (
              <>this transaction?</>
            ) : (
              <>{selected.length} transactions?</>
            )}{' '}
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? 'Deleting…' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
