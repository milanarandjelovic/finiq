'use client'

import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { RotateCcw } from 'lucide-react'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()
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
        {t('budget.resetCount', { count: selected.length })}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selected.length === 1
                ? t('budget.resetBudget')
                : t('budget.resetBudgets')}
            </DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm">
            {selected.length === 1
              ? t('budget.resetBudgetSingleConfirm', {
                  name: selected[0]?.categoryName,
                })
              : t('budget.resetBudgetMultipleConfirm', {
                  count: selected.length,
                })}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t('general.cancel')}
            </Button>
            <Button onClick={handleReset} variant="destructive">
              {t('general.reset')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
