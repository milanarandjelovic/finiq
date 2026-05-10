'use client'

import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { budgetFormSchema, type BudgetFormValues } from '@finiq/schemas'
import { Button } from '@finiq/ui/components/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@finiq/ui/components/form'
import { Input } from '@finiq/ui/components/input'

interface BudgetFormProps {
  currentAmount: number
  isEditing: boolean
  open: boolean
  onSubmit: (values: BudgetFormValues) => void
  onCancel: () => void
}

export function BudgetForm({
  currentAmount,
  isEditing,
  open,
  onSubmit,
  onCancel,
}: BudgetFormProps) {
  const { t } = useTranslation()
  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: { amount: currentAmount },
  })

  useEffect(() => {
    if (open) {
      form.reset({ amount: currentAmount })
    }
  }, [open, currentAmount, form])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('budget.amount')}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  autoFocus
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t('general.cancel')}
          </Button>
          <Button type="submit">
            {isEditing ? t('general.saveChanges') : t('budget.assign')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
