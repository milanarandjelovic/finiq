'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import {
  getCategoryControllerFindAllQueryKey,
  useCategoryControllerUpdate,
} from '@/api/__generated__/categories/categories'
import type { Category } from '@/api/__generated__/models'
import { GoalForm } from '@/app/(dashboard)/dashboard/goals/_components/goal-form'
import { CrudDialog } from '@/components/shared/crud-dialog'
import { crudMutationOptions } from '@/lib/mutation'

interface EditGoalDialogProps {
  goal: Category | null
  onClose: () => void
}

export function EditGoalDialog({ goal, onClose }: EditGoalDialogProps) {
  const { t } = useTranslation()
  const qc = useQueryClient()

  const { mutateAsync: updateGoal, isPending: isUpdating } =
    useCategoryControllerUpdate(
      crudMutationOptions(qc, {
        queryKeys: [getCategoryControllerFindAllQueryKey()],
        successMessage: t('goals.goalUpdated'),
        errorMessage: t('goals.failedToUpdate'),
        onSuccess: onClose,
      }),
    )

  return (
    <CrudDialog
      open={!!goal}
      onOpenChange={(o) => !o && onClose()}
      title={t('goals.editGoal')}
    >
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
    </CrudDialog>
  )
}
