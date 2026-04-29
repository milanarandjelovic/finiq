'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { Plus } from 'lucide-react'
import { useForm, type Resolver } from 'react-hook-form'
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
          toast.success('Transaction added')
          form.reset({
            type: 'expense',
            amount: 0,
            date: format(new Date(), 'yyyy-MM-dd'),
            note: '',
          })
          onSuccess()
        },
        onError() {
          toast.error('Failed to add transaction')
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
          Add transaction
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add transaction</DialogTitle>
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
                  <FormLabel>Type</FormLabel>
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
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
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
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="0.00"
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
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          {field.value
                            ? format(new Date(field.value), 'PPP')
                            : 'Pick a date'}
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
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
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
                  <FormLabel>Note (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="What was this for?" {...field} />
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
              Add transaction
            </LoadingButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
