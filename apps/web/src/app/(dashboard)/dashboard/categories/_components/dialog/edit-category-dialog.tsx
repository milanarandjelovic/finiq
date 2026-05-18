'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { type CategoryFormValues } from '@finiq/schemas'
import {
  getCategoryControllerFindAllQueryKey,
  useCategoryControllerUpdate,
} from '@/api/__generated__/categories/categories'
import type { Category } from '@/api/__generated__/models'
import { CategoryForm } from '@/app/(dashboard)/dashboard/categories/_components/category-form'
import { CrudDialog } from '@/components/shared/crud-dialog'
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

  const handleOpenChange = (o: boolean) => !o && onClose()

  const handleSubmit = async (values: CategoryFormValues) => {
    if (!category) {
      return
    }

    await updateCategory({ id: category.id, data: values })
  }

  const defaultValues = category
    ? {
        name: category.name,
        emoji: category.emoji,
        color: category.color,
        budgetAmount: Number(category.budgetAmount),
        isGoal: category.isGoal,
      }
    : undefined

  return (
    <CrudDialog
      open={!!category}
      onOpenChange={handleOpenChange}
      title={t('categories.editCategory')}
    >
      {category && (
        <CategoryForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          isPending={isUpdating}
        />
      )}
    </CrudDialog>
  )
}
