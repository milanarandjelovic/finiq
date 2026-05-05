'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const qc = useQueryClient()

  const { mutateAsync: createCategory, isPending: isCreating } =
    useCategoryControllerCreate(
      crudMutationOptions(qc, {
        queryKeys: [getCategoryControllerFindAllQueryKey()],
        successMessage: t('categories.categoryCreated'),
        errorMessage: t('categories.failedToCreate'),
        onSuccess: () => setOpen(false),
      }),
    )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          {t('categories.addCategory')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('categories.newCategory')}</DialogTitle>
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
