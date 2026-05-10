'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { type Table } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

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

interface CategoriesTableToolbarActionsProps {
  table: Table<Category>
}

export function CategoriesTableToolbarActions({
  table,
}: CategoriesTableToolbarActionsProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const qc = useQueryClient()

  const { mutateAsync: deleteCategory, isPending } =
    useCategoryControllerDelete({
      mutation: {
        onError: () => toast.error(t('categories.failedToDeleteMultiple')),
      },
    })

  const selected = table
    .getFilteredSelectedRowModel()
    .rows.map((r) => r.original)

  if (selected.length === 0) {
    return null
  }

  async function handleDelete() {
    await Promise.all(selected.map((c) => deleteCategory({ id: c.id })))
    await qc.invalidateQueries({
      queryKey: getCategoryControllerFindAllQueryKey(),
    })
    toast.success(
      selected.length === 1
        ? t('categories.categoryDeleted')
        : t('categories.categoriesDeleted', { count: selected.length }),
    )
    table.resetRowSelection()
    setOpen(false)
  }

  return (
    <>
      <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
        <Trash2 className="mr-1.5 size-4" />
        {t('categories.deleteCount', { count: selected.length })}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selected.length === 1
                ? t('categories.deleteCategory')
                : t('categories.deleteCategories')}
            </DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm">
            {selected.length === 1
              ? t('categories.deleteCategoryConfirm', {
                  name: selected[0]?.name,
                })
              : t('categories.deleteCategoriesConfirm', {
                  count: selected.length,
                })}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t('general.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? t('general.deleting') : t('general.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
