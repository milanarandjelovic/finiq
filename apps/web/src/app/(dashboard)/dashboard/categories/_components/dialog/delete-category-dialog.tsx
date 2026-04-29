'use client'

import { useQueryClient } from '@tanstack/react-query'

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
  const qc = useQueryClient()

  const { mutateAsync: deleteCategory } = useCategoryControllerDelete(
    crudMutationOptions(qc, {
      queryKeys: [getCategoryControllerFindAllQueryKey()],
      successMessage: 'Category deleted',
      errorMessage: 'Failed to delete category',
      onSuccess: onClose,
    }),
  )

  return (
    <Dialog open={!!category} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete category</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          Are you sure you want to delete{' '}
          <span className="text-foreground font-medium">{category?.name}</span>?
          This action cannot be undone.
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => category && deleteCategory({ id: category.id })}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
