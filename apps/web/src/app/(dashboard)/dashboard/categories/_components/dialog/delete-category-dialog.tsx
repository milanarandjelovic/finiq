'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { Button } from '@finiq/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@finiq/ui/components/dialog'
import {
  getCategoryControllerFindAllQueryKey,
  useCategoryControllerDelete,
} from '@/api/__generated__/categories/categories'
import type { Category } from '@/api/__generated__/models'
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
    <Dialog open={!!category} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t('general.delete')} {t('general.name')}
          </DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          {t('categories.deleteConfirm', { name: category?.name })}
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t('general.cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={() => category && deleteCategory({ id: category.id })}
          >
            {t('general.delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
