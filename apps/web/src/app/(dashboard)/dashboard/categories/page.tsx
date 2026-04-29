'use client'

import { useState } from 'react'

import type { Category } from '@/api/__generated__/models'
import { AddCategoryDialog } from '@/app/(dashboard)/dashboard/categories/_components/dialog/add-category-dialog'
import { DeleteCategoryDialog } from '@/app/(dashboard)/dashboard/categories/_components/dialog/delete-category-dialog'
import { EditCategoryDialog } from '@/app/(dashboard)/dashboard/categories/_components/dialog/edit-category-dialog'
import { CategoriesTable } from '@/app/(dashboard)/dashboard/categories/_components/table/categories-table'

export default function CategoriesPage() {
  const [editTarget, setEditTarget] = useState<Category | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <AddCategoryDialog />
      </div>

      <CategoriesTable
        isGoal={0}
        onEdit={setEditTarget}
        onDelete={setDeleteTarget}
      />

      <EditCategoryDialog
        category={editTarget}
        onClose={() => setEditTarget(null)}
      />

      <DeleteCategoryDialog
        category={deleteTarget}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  )
}
