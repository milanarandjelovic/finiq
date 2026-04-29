import { useState } from 'react'
import { MoreHorizontal } from 'lucide-react'

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
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => setShowAssignDialog(true)}
          >
            {isEditing ? 'Edit budget' : 'Assign budget'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
