import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'
import { ScrollView, StyleSheet, Text } from 'react-native'

import { settingsFormSchema, type SettingsFormValues } from '@finiq/schemas'
import { CurrencyPicker } from '@/components/currency-picker'
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
import { routes } from '@/util/routes'

export default function SettingsView() {
  const router = useRouter()
  const { data: settings } = useSettings()
  const { mutate: updateSettings, isPending } = useSettingsUpdate()
  const { logout } = useAuthSession()

  const handleLogout = async () => {
    await logout()
    router.replace(routes.login)
  }
  const { control, handleSubmit, setValue } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
  })

  useEffect(() => {
    if (settings?.currency) {
      setValue('currency', settings.currency as SettingsFormValues['currency'])
    }
  }, [settings, setValue])

  const onSubmit = (values: SettingsFormValues) => {
    updateSettings(values)
  }

  return (
    <Screen>
      <ScreenHeader title="Settings" />
      <ScrollView contentContainerStyle={styles.container}>
        <SurfaceView style={styles.card}>
          <Text style={styles.cardTitle}>Preferences</Text>

          <FormField label="Theme">
            <ThemeToggle variant="segmented" />
          </FormField>

          <MutedText>Set your preferred currency for display.</MutedText>
          <Controller
            control={control}
            name="currency"
            render={({ field }) => (
              <FormField label="Currency">
                <CurrencyPicker
                  value={field.value ?? 'USD'}
                  onChange={field.onChange}
                />
              </FormField>
            )}
          />
          <Button
            label="Save settings"
            onPress={handleSubmit(onSubmit)}
            loading={isPending}
          />
        </SurfaceView>

        <Button label="Sign out" variant="outline" onPress={handleLogout} />
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
