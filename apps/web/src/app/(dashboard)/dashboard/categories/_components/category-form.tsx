'use client'

import { useTranslation } from 'react-i18next'

import { categoryFormSchema, type CategoryFormValues } from '@finiq/schemas'
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
import { Switch } from '@finiq/ui/components/switch'
import { useZodForm } from '@/hooks/use-zod-form'

export function CategoryForm({
  defaultValues,
  onSubmit,
  isPending,
}: {
  defaultValues?: Partial<CategoryFormValues>
  onSubmit: (values: CategoryFormValues) => Promise<void>
  isPending: boolean
}) {
  const { t } = useTranslation()
  const form = useZodForm<CategoryFormValues>(categoryFormSchema(t), {
    defaultValues: {
      name: '',
      emoji: '💰',
      color: '#6366f1',
      budgetAmount: 0,
      ...defaultValues,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleApiSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="emoji"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('categories.emoji')}</FormLabel>
                <FormControl>
                  <Input placeholder="🛒" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('categories.color')}</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="size-9 cursor-pointer rounded-md border"
                    />
                    <Input
                      placeholder={t('categories.colorPlaceholder')}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('general.name')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('categories.namePlaceholder')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="budgetAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('categories.monthlyBudget')}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder={t('categories.monthlyBudgetPlaceholder')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isGoal"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>{t('categories.goalCategory')}</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <LoadingButton type="submit" className="w-full" isLoading={isPending}>
          {t('categories.saveCategory')}
        </LoadingButton>
      </form>
    </Form>
  )
}
