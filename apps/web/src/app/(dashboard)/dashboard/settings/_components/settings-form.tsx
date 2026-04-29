'use client'

import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { settingsFormSchema, type SettingsFormValues } from '@finiq/schemas'
import type { CurrencyValue } from '@finiq/shared'
import { CURRENCIES } from '@finiq/shared'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@finiq/ui/components/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@finiq/ui/components/form'
import { LoadingButton } from '@finiq/ui/components/loading-button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@finiq/ui/components/select'
import { Skeleton } from '@finiq/ui/components/skeleton'
import type {
  SettingControllerFindAll200,
  UpdateSettingsPayloadDto,
} from '@/api/__generated__/models'
import {
  getSettingControllerFindAllQueryKey,
  useSettingControllerFindAll,
  useSettingControllerUpdate,
} from '@/api/__generated__/settings/settings'
import { applyValidationErrors } from '@/lib/form-validation'
import type { BackendValidationError } from '@/types/form-validation'

export function SettingsForm() {
  const qc = useQueryClient()

  const { data: settingsResult, isLoading } = useSettingControllerFindAll()
  const settings = (
    settingsResult?.data as SettingControllerFindAll200 | undefined
  )?.data?.settings

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      currency: CURRENCIES[0].value,
    },
  })

  useEffect(() => {
    if (settings?.currency) {
      form.setValue('currency', settings?.currency as CurrencyValue)
    }
  }, [settings, form])

  const { mutateAsync: updateSettings, isPending } = useSettingControllerUpdate(
    {
      mutation: {
        onSuccess() {
          qc.invalidateQueries({
            queryKey: getSettingControllerFindAllQueryKey(),
          })
          toast.success('Settings saved')
        },
        onError(error: {
          statusCode?: number
          errors?: BackendValidationError[]
        }) {
          if (error.statusCode === 400) {
            applyValidationErrors(form, error.errors)
          } else {
            toast.error('Failed to save settings')
          }
        },
      },
    },
  )

  const handleSubmit = async (values: SettingsFormValues): Promise<void> => {
    await updateSettings({
      data: values as unknown as UpdateSettingsPayloadDto,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>Set your currency preference.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select
                      key={field.value}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CURRENCIES.map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <LoadingButton type="submit" isLoading={isPending}>
                Save settings
              </LoadingButton>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  )
}
