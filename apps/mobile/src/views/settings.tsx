import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, Text } from 'react-native'

import { settingsFormSchema, type SettingsFormValues } from '@finiq/schemas'
import { CurrencyPicker } from '@/components/currency-picker'
import { LanguagePicker } from '@/components/language-picker'
import { ScreenHeader } from '@/components/screen-header'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { MutedText } from '@/components/ui/muted-text'
import { Screen } from '@/components/ui/screen'
import { SurfaceView } from '@/components/ui/surface-view'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useSettings } from '@/hooks/data/use-settings'
import { useSettingsUpdate } from '@/hooks/data/use-settings-update'
import { useAuthSession } from '@/hooks/use-auth-session'
import { ROUTES } from '@/util/routes'

export default function SettingsView() {
  const { t } = useTranslation()
  const router = useRouter()
  const { data: settings } = useSettings()
  const { mutate: updateSettings, isPending } = useSettingsUpdate()
  const { logout } = useAuthSession()

  const handleLogout = async () => {
    await logout()
    router.replace(ROUTES.LOGIN)
  }
  const { control, handleSubmit, setValue } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
  })

  useEffect(() => {
    if (settings?.currency) {
      setValue('currency', settings.currency)
    }
  }, [settings, setValue])

  const onSubmit = (values: SettingsFormValues) => {
    updateSettings(values)
  }

  return (
    <Screen>
      <ScreenHeader title={t('settings.title')} />
      <ScrollView contentContainerStyle={styles.container}>
        <SurfaceView style={styles.card}>
          <Text style={styles.cardTitle}>{t('settings.preferences')}</Text>

          <FormField label={t('settings.theme')}>
            <ThemeToggle variant="segmented" />
          </FormField>

          <FormField label={t('settings.language')}>
            <LanguagePicker />
          </FormField>

          <MutedText>{t('settings.preferencesDescription')}</MutedText>
          <Controller
            control={control}
            name="currency"
            render={({ field }) => (
              <FormField label={t('settings.currency')}>
                <CurrencyPicker
                  value={field.value ?? 'USD'}
                  onChange={field.onChange}
                />
              </FormField>
            )}
          />
          <Button
            label={t('general.saveChanges')}
            onPress={handleSubmit(onSubmit)}
            loading={isPending}
          />
        </SurfaceView>

        <Button
          label={t('general.signOut')}
          variant="outline"
          onPress={handleLogout}
        />
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
})
