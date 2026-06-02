import { useState } from 'react'
import { MoreHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@finiq/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@finiq/ui/components/dropdown-menu'
import { BudgetAssignDialog } from '@/app/(dashboard)/dashboard/budget/_components/dialog/budget-assign-dialog'
import { BudgetRow } from '@/app/(dashboard)/dashboard/budget/_components/table/budget-table-columns'

export function BudgetActionsCell({ row }: { row: BudgetRow }) {
  const { t } = useTranslation()
  const [showAssignDialog, setShowAssignDialog] = useState(false)
  const isEditing = row.budgeted > 0

  return (
    <>
      <BudgetAssignDialog
        open={showAssignDialog}
        onOpenChange={setShowAssignDialog}
        categoryName={row.categoryName}
        categoryEmoji={row.categoryEmoji}
        currentAmount={row.budgeted}
        onSave={(amount) => row.onUpsert(row.categoryId, amount)}
      />

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            data-testid="budget-row-actions"
          >
            <span className="sr-only">{t('general.openMenu')}</span>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => setShowAssignDialog(true)}
            data-testid="budget-assign-action"
          >
            {isEditing ? t('budget.editBudget') : t('budget.assignBudget')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
