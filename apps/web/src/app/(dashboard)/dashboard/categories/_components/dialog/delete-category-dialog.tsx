'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import {
  getCategoryControllerFindAllQueryKey,
  useCategoryControllerDelete,
} from '@/api/__generated__/categories/categories'
import type { Category } from '@/api/__generated__/models'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { crudMutationOptions } from '@/lib/mutation'

interface DeleteCategoryDialogProps {
  category: Category | null
  onClose: () => void
}

export function DeleteCategoryDialog({
  category,
  onClose,
}: DeleteCategoryDialogProps) {
  const { t } = useTranslation()
  const qc = useQueryClient()

  const { mutateAsync: deleteCategory } = useCategoryControllerDelete(
    crudMutationOptions(qc, {
      queryKeys: [getCategoryControllerFindAllQueryKey()],
      successMessage: t('categories.categoryDeleted'),
      errorMessage: t('categories.failedToDelete'),
      onSuccess: onClose,
    }),
  )

  return (
    <ConfirmDialog
      open={!!category}
      onOpenChange={(o) => !o && onClose()}
      title={t('categories.deleteCategory')}
      description={t('categories.deleteCategoryConfirm', {
        name: category?.name,
      })}
      onConfirm={() => {
        if (category) deleteCategory({ id: category.id })
      }}
    />
  )
}
