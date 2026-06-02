'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { type GoalFormValues } from '@finiq/schemas'
import { Button } from '@finiq/ui/components/button'
import {
  getCategoryControllerFindAllQueryKey,
  useCategoryControllerCreate,
} from '@/api/__generated__/categories/categories'
import { GoalForm } from '@/app/(dashboard)/dashboard/goals/_components/goal-form'
import { CrudDialog } from '@/components/shared/crud-dialog'
import { crudMutationOptions } from '@/lib/mutation'

export function AddGoalDialog() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const qc = useQueryClient()

  const { mutateAsync: createGoal, isPending: isCreating } =
    useCategoryControllerCreate(
      crudMutationOptions(qc, {
        queryKeys: [getCategoryControllerFindAllQueryKey()],
        successMessage: t('goals.goalCreated'),
        errorMessage: t('goals.failedToCreate'),
        onSuccess: () => setOpen(false),
      }),
    )

  const handleSubmit = async (values: GoalFormValues) => {
    await createGoal({
      data: {
        ...values,
        isGoal: true,
        targetDate: values.targetDate,
      },
    })
  }

  return (
    <CrudDialog
      open={open}
      onOpenChange={setOpen}
      title={t('goals.newSavingsGoal')}
      trigger={
        <Button data-testid="add-goal-btn">
          <Plus />
          {t('goals.newGoal')}
        </Button>
      }
    >
      <GoalForm onSubmit={handleSubmit} isPending={isCreating} />
    </CrudDialog>
  )
}
