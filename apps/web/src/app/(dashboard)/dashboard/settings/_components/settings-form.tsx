'use client'

import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { settingsFormSchema, type SettingsFormValues } from '@finiq/schemas'
import type { CurrencyValue } from '@finiq/shared'
import {
  CURRENCIES,
  LANGUAGE_AVAILABLE_NAMES,
  LANGUAGE_STORAGE_KEY,
} from '@finiq/shared'
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
import { changeLanguage } from '@/i18n'
import { applyValidationErrors } from '@/lib/form-validation'
import type { BackendValidationError } from '@/types/form-validation'

export function SettingsForm() {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const [currentLang, setCurrentLang] = useState(
    Cookies.get(LANGUAGE_STORAGE_KEY) || 'en',
  )

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

  const handleLanguageChange = async (lang: string) => {
    setCurrentLang(lang)
    Cookies.set(LANGUAGE_STORAGE_KEY, lang, { expires: 365 })
    await changeLanguage(lang)
    toast.success(t('settings.languageUpdated'))
  }

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
        <CardTitle>{t('settings.preferences')}</CardTitle>
        <CardDescription>
          {t('settings.preferencesDescription')}
        </CardDescription>
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
                    <FormLabel>{t('settings.currency')}</FormLabel>
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
              <FormItem>
                <FormLabel>{t('settings.language')}</FormLabel>
                <Select
                  value={currentLang}
                  onValueChange={handleLanguageChange}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue>
                        {LANGUAGE_AVAILABLE_NAMES[currentLang] || currentLang}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(LANGUAGE_AVAILABLE_NAMES).map(
                      ([code, name]) => (
                        <SelectItem key={code} value={code}>
                          {name}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </FormItem>
              <LoadingButton type="submit" isLoading={isPending}>
                {t('settings.saveSettings')}
              </LoadingButton>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  )
}
