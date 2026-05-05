'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

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
import { CategoryForm } from '@/app/(dashboard)/dashboard/categories/_components/category-form'
import { crudMutationOptions } from '@/lib/mutation'

interface EditCategoryDialogProps {
  category: Category | null
  onClose: () => void
}

export function EditCategoryDialog({
  category,
  onClose,
}: EditCategoryDialogProps) {
  const { t } = useTranslation()
  const qc = useQueryClient()

  const { mutateAsync: updateCategory, isPending: isUpdating } =
    useCategoryControllerUpdate(
      crudMutationOptions(qc, {
        queryKeys: [getCategoryControllerFindAllQueryKey()],
        successMessage: t('categories.categoryUpdated'),
        errorMessage: t('categories.failedToUpdate'),
        onSuccess: onClose,
      }),
    )

  return (
    <Dialog open={!!category} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('categories.editCategory')}</DialogTitle>
        </DialogHeader>
        {category && (
          <CategoryForm
            defaultValues={{
              name: category.name,
              emoji: category.emoji,
              color: category.color,
              budgetAmount: Number(category.budgetAmount),
              isGoal: category.isGoal,
            }}
            onSubmit={async (v) => {
              await updateCategory({ id: category.id, data: v })
            }}
            isPending={isUpdating}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
