import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text } from 'react-native'

import {
  forgotPasswordFormSchema,
  type ForgotPasswordFormValues,
} from '@finiq/schemas'
import { AppTextInput } from '@/components/ui/app-text-input'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { useForgotPassword } from '@/hooks/auth/use-forgot-password'
import { useTheme } from '@/hooks/use-theme'

export function ForgotPasswordForm({
  onSuccess,
}: {
  onSuccess: (email: string) => void
}) {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const { mutate: forgotPassword, isPending } = useForgotPassword()

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordFormSchema(t)),
  })

  const {
    control,
    formState: { errors },
  } = form

  const onSubmit = form.handleSubmit(({ email }) => {
    forgotPassword(
      { email },
      {
        onSuccess: () => onSuccess(email),
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

      {errors.root && (
        <Text style={[styles.rootError, { color: colors.destructive }]}>
          {errors.root.message}
        </Text>
      )}

      <Button
        label={t('auth.forgotPasswordSubmit')}
        onPress={onSubmit}
        loading={isPending}
      />
    </>
  )
}

const styles = StyleSheet.create({
  rootError: { fontSize: 13, textAlign: 'center' },
})
