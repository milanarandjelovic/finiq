'use client'

import { useQueryClient } from '@tanstack/react-query'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@finiq/ui/components/dialog'
import {
  getCategoryControllerFindAllQueryKey,
  useCategoryControllerUpdate,
} from '@/api/__generated__/categories/categories'
import type { Category } from '@/api/__generated__/models'
import { GoalForm } from '@/app/(dashboard)/dashboard/goals/_components/goal-form'
import { crudMutationOptions } from '@/lib/mutation'

interface EditGoalDialogProps {
  goal: Category | null
  onClose: () => void
}

export function EditGoalDialog({ goal, onClose }: EditGoalDialogProps) {
  const qc = useQueryClient()

  const { mutateAsync: updateGoal, isPending: isUpdating } =
    useCategoryControllerUpdate(
      crudMutationOptions(qc, {
        queryKeys: [getCategoryControllerFindAllQueryKey()],
        successMessage: 'Goal updated',
        errorMessage: 'Failed to update goal',
        onSuccess: onClose,
      }),
    )

  return (
    <Dialog open={!!goal} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit goal</DialogTitle>
        </DialogHeader>
        {goal && (
          <GoalForm
            defaultValues={{
              name: goal.name,
              emoji: goal.emoji,
              color: goal.color,
              targetAmount: Number(goal.targetAmount) || 0,
              budgetAmount: Number(goal.budgetAmount),
              targetDate:
                goal.targetDate instanceof Date
                  ? goal.targetDate.toISOString().split('T')[0]
                  : (goal.targetDate ?? undefined),
            }}
            onSubmit={async (v) => {
              await updateGoal({
                id: goal.id,
                data: {
                  ...v,
                  isGoal: true,
                  targetDate: v.targetDate,
                },
              })
            }}
            isPending={isUpdating}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
