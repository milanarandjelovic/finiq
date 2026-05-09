'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@finiq/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@finiq/ui/components/dialog'
import {
  getCategoryControllerFindAllQueryKey,
  useCategoryControllerCreate,
} from '@/api/__generated__/categories/categories'
import { GoalForm } from '@/app/(dashboard)/dashboard/goals/_components/goal-form'
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          {t('goals.newGoal')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('goals.newSavingsGoal')}</DialogTitle>
        </DialogHeader>
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
      </DialogContent>
    </Dialog>
  )
}
