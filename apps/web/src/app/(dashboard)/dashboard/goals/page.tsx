'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import {
  getCategoryControllerFindAllQueryKey,
  useCategoryControllerDelete,
} from '@/api/__generated__/categories/categories'
import type { Category } from '@/api/__generated__/models'
import { CategoriesTable } from '@/app/(dashboard)/dashboard/categories/_components/table/categories-table'
import { AddGoalDialog } from '@/app/(dashboard)/dashboard/goals/_components/dialog/add-goal-dialog'
import { DeleteGoalDialog } from '@/app/(dashboard)/dashboard/goals/_components/dialog/delete-goal-dialog'
import { EditGoalDialog } from '@/app/(dashboard)/dashboard/goals/_components/dialog/edit-goal-dialog'
import { crudMutationOptions } from '@/lib/mutation'

export default function GoalsPage() {
  const [editTarget, setEditTarget] = useState<Category | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)
  const qc = useQueryClient()

  const { mutateAsync: deleteGoal } = useCategoryControllerDelete(
    crudMutationOptions(qc, {
      queryKeys: [getCategoryControllerFindAllQueryKey()],
      successMessage: 'Goal deleted',
      errorMessage: 'Failed to delete goal',
      onSuccess: () => setDeleteTarget(null),
    }),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Goals</h1>
          <p className="text-muted-foreground text-sm">
            Track your savings targets.
          </p>
        </div>
        <AddGoalDialog />
      </div>

      <CategoriesTable
        isGoal={1}
        onEdit={setEditTarget}
        onDelete={setDeleteTarget}
      />

      <EditGoalDialog goal={editTarget} onClose={() => setEditTarget(null)} />

      <DeleteGoalDialog
        open={!!deleteTarget}
        goalName={deleteTarget?.name ?? ''}
        onConfirm={() => deleteTarget && deleteGoal({ id: deleteTarget.id })}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
