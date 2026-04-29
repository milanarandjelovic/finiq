'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { type Table } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
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
  const [open, setOpen] = useState(false)
  const qc = useQueryClient()

  const { mutateAsync: deleteCategory, isPending } =
    useCategoryControllerDelete({
      mutation: {
        onError: () => toast.error('Failed to delete categories'),
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
        ? 'Category deleted'
        : `${selected.length} categories deleted`,
    )
    table.resetRowSelection()
    setOpen(false)
  }

  return (
    <>
      <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
        <Trash2 className="mr-1.5 size-4" />
        Delete ({selected.length})
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Delete {selected.length === 1 ? 'category' : 'categories'}
            </DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm">
            Are you sure you want to delete{' '}
            {selected.length === 1 ? (
              <>
                <span className="text-foreground font-medium">
                  {selected[0]?.name}
                </span>
                ?
              </>
            ) : (
              <>{selected.length} categories?</>
            )}{' '}
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? 'Deleting…' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
