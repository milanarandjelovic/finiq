'use client'

import { useTranslation } from 'react-i18next'

import { type BudgetFormValues } from '@finiq/schemas'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@finiq/ui/components/dialog'
import { BudgetForm } from '@/app/(dashboard)/dashboard/budget/_components/budget-form'

interface BudgetAssignDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categoryName: string
  categoryEmoji: string
  currentAmount: number
  onSave: (amount: number) => void
}

export function BudgetAssignDialog({
  open,
  onOpenChange,
  categoryName,
  categoryEmoji,
  currentAmount,
  onSave,
}: BudgetAssignDialogProps) {
  const { t } = useTranslation()
  const isEditing = currentAmount > 0

  function handleSubmit(values: BudgetFormValues) {
    onSave(values.amount)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{categoryEmoji}</span>
            {isEditing
              ? t('budget.editBudget')
              : t('budget.assignBudget')} - {categoryName}
          </DialogTitle>
        </DialogHeader>

        <BudgetForm
          currentAmount={currentAmount}
          isEditing={isEditing}
          open={open}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
