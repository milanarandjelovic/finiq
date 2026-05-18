'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { type CategoryFormValues } from '@finiq/schemas'
import { Button } from '@finiq/ui/components/button'
import {
  getCategoryControllerFindAllQueryKey,
  useCategoryControllerCreate,
} from '@/api/__generated__/categories/categories'
import { CategoryForm } from '@/app/(dashboard)/dashboard/categories/_components/category-form'
import { CrudDialog } from '@/components/shared/crud-dialog'
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

  const handleSubmit = async (values: CategoryFormValues) => {
    await createCategory({ data: values })
  }

  return (
    <CrudDialog
      open={open}
      onOpenChange={setOpen}
      title={t('categories.newCategory')}
      trigger={
        <Button>
          <Plus />
          {t('categories.addCategory')}
        </Button>
      }
    >
      <CategoryForm onSubmit={handleSubmit} isPending={isCreating} />
    </CrudDialog>
  )
}
