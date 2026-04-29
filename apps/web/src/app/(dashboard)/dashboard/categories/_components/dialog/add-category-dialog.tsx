'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'

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
import { CategoryForm } from '@/app/(dashboard)/dashboard/categories/_components/category-form'
import { crudMutationOptions } from '@/lib/mutation'

export function AddCategoryDialog() {
  const [open, setOpen] = useState(false)
  const qc = useQueryClient()

  const { mutateAsync: createCategory, isPending: isCreating } =
    useCategoryControllerCreate(
      crudMutationOptions(qc, {
        queryKeys: [getCategoryControllerFindAllQueryKey()],
        successMessage: 'Category created',
        errorMessage: 'Failed to create category',
        onSuccess: () => setOpen(false),
      }),
    )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Add category
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New category</DialogTitle>
        </DialogHeader>
        <CategoryForm
          onSubmit={async (v) => {
            await createCategory({ data: v })
          }}
          isPending={isCreating}
        />
      </DialogContent>
    </Dialog>
  )
}
