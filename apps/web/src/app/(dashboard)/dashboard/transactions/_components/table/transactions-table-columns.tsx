'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'

import { Checkbox } from '@finiq/ui/components/checkbox'
import { cn } from '@finiq/ui/lib/utils'
import type { Category } from '@/api/__generated__/models'
import { TransactionActionsCell } from '@/app/(dashboard)/dashboard/transactions/_components/table/transactions-actions-cell'

export interface TransactionRow {
  id: string
  type: 'income' | 'expense'
  amount: number
  date: string | Date
  note?: string | null
  category?: Category | null
  categoryName: string
  onDelete: (id: string) => void
}

type FormatCurrencyFn = (amount: number) => string

export function getColumns(
  formatCurrency: FormatCurrencyFn,
): ColumnDef<TransactionRow>[] {
  return [
    {
      id: 'select',
      enableSorting: false,
      enableHiding: false,
      size: 20,
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      ),
    },
    {
      accessorKey: 'categoryName',
      header: () => null,
      enableHiding: false,
      size: 0,
      cell: () => null,
    },
    {
      accessorKey: 'date',
      header: 'Date',
      size: 100,
      cell: ({ row }) => (
        <span className="text-muted-foreground tabular-nums">
          {format(new Date(row.original.date), 'MMM d')}
        </span>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      size: 110,
      cell: ({ row }) => (
        <span
          className={cn(
            'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
            row.original.type === 'income'
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
          )}
        >
          {row.original.type === 'income' ? 'Income' : 'Expense'}
        </span>
      ),
    },
    {
      id: 'category',
      header: 'Category',
      size: 160,
      cell: ({ row }) =>
        row.original.category ? (
          <span>
            {row.original.category.emoji} {row.original.category.name}
          </span>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
    {
      accessorKey: 'note',
      header: 'Note',
      size: 200,
      cell: ({ row }) => (
        <span className="text-muted-foreground block max-w-40 truncate">
          {row.original.note ?? '-'}
        </span>
      ),
    },
    {
      id: 'amount',
      header: () => <div className="text-right">Amount</div>,
      size: 130,
      cell: ({ row }) => (
        <div
          className={cn(
            'text-right font-medium tabular-nums',
            row.original.type === 'income'
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-600 dark:text-red-400',
          )}
        >
          {row.original.type === 'income' ? '+' : '−'}
          {formatCurrency(row.original.amount)}
        </div>
      ),
    },
    {
      id: 'actions',
      header: '',
      size: 40,
      enableHiding: false,
      cell: ({ row }) => <TransactionActionsCell row={row.original} />,
    },
  ]
}
