import { zodResolver } from '@hookform/resolvers/zod'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text } from 'react-native'

import {
  resetPasswordFormSchema,
  type ResetPasswordFormValues,
} from '@finiq/schemas'
import { AppTextInput } from '@/components/ui/app-text-input'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { useResetPassword } from '@/hooks/auth/use-reset-password'
import { useTheme } from '@/hooks/use-theme'
import { ROUTES } from '@/util/routes'

export function ResetPasswordForm() {
  const { t } = useTranslation()
  const router = useRouter()
  const { token } = useLocalSearchParams<{ token: string }>()
  const { colors } = useTheme()
  const { mutate: resetPassword, isPending } = useResetPassword()

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordFormSchema(t)),
  })

  const {
    control,
    formState: { errors },
  } = form

  const onSubmit = form.handleSubmit((values) => {
    resetPassword(
      { ...values, token },
      {
        onSuccess: () => router.replace(ROUTES.LOGIN),
        onError: () =>
          form.setError('root', { message: t('general.somethingWentWrong') }),
      },
    )
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
            label={t('general.newPassword')}
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

      <Controller
        control={control}
        name="passwordConfirmation"
        render={({ field }) => (
          <FormField
            label={t('profile.confirmNewPassword')}
            error={errors.passwordConfirmation?.message}
          >
            <AppTextInput
              value={field.value}
              onChangeText={field.onChange}
              secureTextEntry
              placeholder={t('auth.passwordPlaceholder')}
              error={errors.passwordConfirmation?.message}
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
        label={t('auth.resetPasswordSubmit')}
        onPress={onSubmit}
        loading={isPending}
      />
    </>
  )
}

const styles = StyleSheet.create({
  rootError: { fontSize: 13, textAlign: 'center' },
})
