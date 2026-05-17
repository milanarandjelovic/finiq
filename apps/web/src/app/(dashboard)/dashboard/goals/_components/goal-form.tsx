'use client'

import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'

import { goalFormSchema, type GoalFormValues } from '@finiq/schemas'
import { Button } from '@finiq/ui/components/button'
import { Calendar } from '@finiq/ui/components/calendar'
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
import { useZodForm } from '@/hooks/use-zod-form'

export function GoalForm({
  defaultValues,
  onSubmit,
  isPending,
}: {
  defaultValues?: Partial<GoalFormValues>
  onSubmit: (values: GoalFormValues) => Promise<void>
  isPending: boolean
}) {
  const { t } = useTranslation()
  const form = useZodForm<GoalFormValues>(goalFormSchema(t), {
    defaultValues: {
      name: '',
      emoji: '🎯',
      color: '#10b981',
      targetAmount: 0,
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
                <FormLabel>{t('goals.emoji')}</FormLabel>
                <FormControl>
                  <Input placeholder="🎯" {...field} />
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
                <FormLabel>{t('goals.color')}</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="size-9 cursor-pointer rounded-md border"
                    />
                    <Input
                      placeholder={t('goals.colorPlaceholder')}
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
              <FormLabel>{t('goals.goalName')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('goals.goalNamePlaceholder')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="targetAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('goals.targetAmount')}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder={t('goals.targetAmountPlaceholder')}
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
              <FormLabel>{t('goals.monthlyContribution')}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder={t('goals.monthlyContributionPlaceholder')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="targetDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('goals.targetDate')}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className="w-full justify-start font-normal"
                    >
                      {field.value
                        ? format(new Date(field.value), 'dd.MM.yyyy')
                        : t('goals.pickADate')}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) =>
                      field.onChange(
                        date ? format(date, 'yyyy-MM-dd') : undefined,
                      )
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton type="submit" className="w-full" isLoading={isPending}>
          {t('goals.saveGoal')}
        </LoadingButton>
      </form>
    </Form>
  )
}
