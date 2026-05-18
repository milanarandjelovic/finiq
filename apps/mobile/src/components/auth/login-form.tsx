import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text } from 'react-native'

import { loginFormSchema, type LoginFormValues } from '@finiq/schemas'
import { AppTextInput } from '@/components/ui/app-text-input'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { useAuthSession } from '@/hooks/use-auth-session'
import { useTheme } from '@/hooks/use-theme'
import { ROUTES } from '@/util/routes'

export function LoginForm() {
  const { t } = useTranslation()
  const router = useRouter()
  const { login } = useAuthSession()
  const { colors } = useTheme()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema(t)),
  })

  const {
    control,
    formState: { errors, isSubmitting },
  } = form

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await login(values)
      router.replace(ROUTES.DASHBOARD)
    } catch {
      form.setError('root', { message: t('errors.unauthorized') })
    }
  })

  return (
    <>
      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <FormField label={t('general.email')} error={errors.email?.message}>
            <AppTextInput
              value={field.value}
              onChangeText={field.onChange}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder={t('auth.emailPlaceholder')}
              error={errors.email?.message}
            />
          </FormField>
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <FormField
            label={t('general.password')}
            error={errors.password?.message}
          >
            <AppTextInput
              value={field.value}
              onChangeText={field.onChange}
              secureTextEntry
              placeholder={t('auth.passwordPlaceholder')}
              error={errors.password?.message}
            />
          </FormField>
        )}
      />

      {errors.root && (
        <Text style={[styles.rootError, { color: colors.destructive }]}>
          {errors.root.message}
        </Text>
      )}

      <Button
        label={t('auth.loginSubmit')}
        onPress={onSubmit}
        loading={isSubmitting}
      />
    </>
  )
}

const styles = StyleSheet.create({
  rootError: { fontSize: 13, textAlign: 'center' },
})
