'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

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

  return (
    <CrudDialog
      open={open}
      onOpenChange={setOpen}
      title={t('goals.newSavingsGoal')}
      trigger={
        <Button>
          <Plus />
          {t('goals.newGoal')}
        </Button>
      }
    >
      <GoalForm
        onSubmit={async (v) => {
          await createGoal({
            data: {
              ...v,
              isGoal: true,
              targetDate: v.targetDate,
            },
          })
        }}
        isPending={isCreating}
      />
    </CrudDialog>
  )
}
