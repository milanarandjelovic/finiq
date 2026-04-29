'use client'

import { type ColumnDef } from '@tanstack/react-table'

import { Checkbox } from '@finiq/ui/components/checkbox'
import { cn } from '@finiq/ui/lib/utils'
import { BudgetActionsCell } from '@/app/(dashboard)/dashboard/budget/_components/table/budget-actions-cell'

export interface BudgetRow {
  categoryId: string
  categoryName: string
  categoryEmoji: string
  categoryColor: string
  budgeted: number
  spent: number
  available: number
  pct: number | null
  isOver: boolean
  assignmentStatus: 'assigned' | 'unassigned'
  onUpsert: (categoryId: string, amount: number) => void
}

type FormatCurrencyFn = (amount: number) => string

export function getColumns(
  formatCurrency: FormatCurrencyFn,
): ColumnDef<BudgetRow>[] {
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
      header: 'Category',
      size: 260,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-base"
            style={{
              backgroundColor: `${row.original.categoryColor}25`,
              border: `1.5px solid ${row.original.categoryColor}40`,
            }}
          >
            {row.original.categoryEmoji}
          </div>
          <span className="font-medium">{row.original.categoryName}</span>
        </div>
      ),
    },
    {
      accessorKey: 'assignmentStatus',
      header: () => null,
      enableHiding: false,
      size: 0,
      filterFn: (row, _id, value: string) =>
        row.original.assignmentStatus === value,
      cell: () => null,
    },
    {
      id: 'assigned',
      header: 'Assigned',
      size: 120,
      cell: ({ row }) => (
        <span className="tabular-nums">
          {formatCurrency(row.original.budgeted)}
        </span>
      ),
    },
    {
      id: 'spent',
      header: 'Spent',
      size: 120,
      cell: ({ row }) => (
        <span className="tabular-nums">
          {formatCurrency(row.original.spent)}
        </span>
      ),
    },
    {
      id: 'available',
      header: 'Available',
      size: 120,
      cell: ({ row }) => (
        <span
          className={cn(
            'tabular-nums',
            row.original.isOver ? 'text-destructive' : '',
          )}
        >
          {formatCurrency(row.original.available)}
        </span>
      ),
    },
    {
      id: 'pct',
      header: '%',
      size: 120,
      cell: ({ row }) =>
        row.original.pct !== null ? (
          <span
            className={cn(
              'tabular-nums',
              row.original.isOver ? 'text-destructive' : '',
            )}
          >
            {row.original.pct}%
          </span>
        ) : (
          <span className="text-muted-foreground">Not assigned</span>
        ),
    },
    {
      id: 'actions',
      header: '',
      size: 40,
      enableHiding: false,
      cell: ({ row }) => <BudgetActionsCell row={row.original} />,
    },
  ]
}
