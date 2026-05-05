'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { Plus } from 'lucide-react'
import { useForm, type Resolver } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import {
  transactionFormSchema,
  type TransactionFormValues,
} from '@finiq/schemas'
import { Button } from '@finiq/ui/components/button'
import { Calendar } from '@finiq/ui/components/calendar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@finiq/ui/components/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@finiq/ui/components/form'
import { Input } from '@finiq/ui/components/input'
import { LoadingButton } from '@finiq/ui/components/loading-button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@finiq/ui/components/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@finiq/ui/components/select'
import type { Category } from '@/api/__generated__/models'
import { useTransactionControllerCreate } from '@/api/__generated__/transactions/transactions'

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
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(
      transactionFormSchema,
    ) as Resolver<TransactionFormValues>,
    defaultValues: {
      type: 'expense',
      amount: 0,
      date: format(new Date(), 'yyyy-MM-dd'),
      note: '',
    },
  })

  const type = form.watch('type')

  const { mutateAsync: createTransaction, isPending } =
    useTransactionControllerCreate({
      mutation: {
        onSuccess() {
          toast.success(t('transactions.transactionAdded'))
          form.reset({
            type: 'expense',
            amount: 0,
            date: format(new Date(), 'yyyy-MM-dd'),
            note: '',
          })
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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('transactions.type')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="expense">
                        {t('transactions.expense')}
                      </SelectItem>
                      <SelectItem value="income">
                        {t('transactions.income')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('transactions.amount')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder={t('transactions.amountPlaceholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('transactions.date')}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          {field.value
                            ? format(new Date(field.value), 'PPP')
                            : t('transactions.pickADate')}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) =>
                          field.onChange(date ? format(date, 'yyyy-MM-dd') : '')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            {type === 'expense' && (
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('transactions.category')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t('transactions.selectCategory')}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.emoji} {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('transactions.noteOptionalLabel')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('transactions.notePlaceholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton
              type="submit"
              className="w-full"
              isLoading={isPending}
            >
              {t('transactions.addTransaction')}
            </LoadingButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
