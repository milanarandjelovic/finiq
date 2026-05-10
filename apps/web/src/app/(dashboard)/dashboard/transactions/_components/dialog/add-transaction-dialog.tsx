'use client'

import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { type TransactionFormValues } from '@finiq/schemas'
import { Button } from '@finiq/ui/components/button'
import type { Category } from '@/api/__generated__/models'
import { useTransactionControllerCreate } from '@/api/__generated__/transactions/transactions'
import { TransactionForm } from '@/app/(dashboard)/dashboard/transactions/_components/transaction-form'
import { CrudDialog } from '@/components/shared/crud-dialog'

export function AddTransactionDialog({
  open,
  onOpenChange,
  categories,
  onSuccess,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  categories: Category[]
  onSuccess: () => void
}) {
  const { t } = useTranslation()

  const { mutateAsync: createTransaction, isPending } =
    useTransactionControllerCreate({
      mutation: {
        onSuccess() {
          toast.success(t('transactions.transactionAdded'))
          onSuccess()
        },
        onError() {
          toast.error(t('transactions.failedToAdd'))
        },
      },
    })

  const handleSubmit = async (values: TransactionFormValues): Promise<void> => {
    await createTransaction({
      data: {
        ...values,
        categoryId: values.categoryId || undefined,
      },
    })
  }

  return (
    <CrudDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('transactions.addTransaction')}
      trigger={
        <Button>
          <Plus />
          {t('transactions.addTransaction')}
        </Button>
      }
    >
      <TransactionForm
        categories={categories}
        onSubmit={handleSubmit}
        isPending={isPending}
      />
    </CrudDialog>
  )
}
