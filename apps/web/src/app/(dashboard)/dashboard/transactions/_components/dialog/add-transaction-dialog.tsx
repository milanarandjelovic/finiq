'use client'

import { format } from 'date-fns'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { type TransactionFormValues } from '@finiq/schemas'
import { Button } from '@finiq/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@finiq/ui/components/dialog'
import type { Category } from '@/api/__generated__/models'
import { useTransactionControllerCreate } from '@/api/__generated__/transactions/transactions'
import { TransactionForm } from '@/app/(dashboard)/dashboard/transactions/_components/transaction-form'

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          {t('transactions.addTransaction')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('transactions.addTransaction')}</DialogTitle>
        </DialogHeader>
        <TransactionForm
          defaultValues={{
            type: 'expense',
            amount: 0,
            date: format(new Date(), 'yyyy-MM-dd'),
            note: '',
          }}
          categories={categories}
          onSubmit={handleSubmit}
          isPending={isPending}
        />
      </DialogContent>
    </Dialog>
  )
}
