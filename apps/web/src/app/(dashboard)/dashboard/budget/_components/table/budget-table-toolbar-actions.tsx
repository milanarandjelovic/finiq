'use client'

import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { RotateCcw } from 'lucide-react'

import { Button } from '@finiq/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@finiq/ui/components/dialog'
import type { BudgetRow } from '@/app/(dashboard)/dashboard/budget/_components/table/budget-table-columns'

interface BudgetTableToolbarActionsProps {
  table: Table<BudgetRow>
  onUpsert: (categoryId: string, amount: number) => void
}

export function BudgetTableToolbarActions({
  table,
  onUpsert,
}: BudgetTableToolbarActionsProps) {
  const [open, setOpen] = useState(false)

  const selected = table
    .getFilteredSelectedRowModel()
    .rows.map((r) => r.original)

  if (selected.length === 0) {
    return null
  }

  function handleReset() {
    selected.forEach((row) => onUpsert(row.categoryId, 0))
    table.resetRowSelection()
    setOpen(false)
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <RotateCcw className="mr-1.5 size-4" />
        Reset ({selected.length})
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Reset {selected.length === 1 ? 'budget' : 'budgets'}
            </DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm">
            Are you sure you want to reset the budget to{' '}
            <span className="text-foreground font-medium">$0</span> for{' '}
            {selected.length === 1 ? (
              <span className="text-foreground font-medium">
                {selected[0]?.categoryName}
              </span>
            ) : (
              <>{selected.length} categories</>
            )}
            ?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReset} variant="destructive">
              Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
