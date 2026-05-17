import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text } from 'react-native'

import { registerFormSchema, type RegisterFormValues } from '@finiq/schemas'
import { AppTextInput } from '@/components/ui/app-text-input'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { useRegister } from '@/hooks/auth/use-register'
import { useTheme } from '@/hooks/use-theme'
import { ROUTES } from '@/util/routes'

export function RegisterForm() {
  const { t } = useTranslation()
  const router = useRouter()
  const { colors } = useTheme()
  const { mutate: register, isPending } = useRegister()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema(t)),
  })

  const {
    control,
    formState: { errors },
  } = form

  const onSubmit = form.handleSubmit((values) => {
    const { passwordConfirmation: _, ...payload } = values
    register(payload, {
      onSuccess: () => router.replace(ROUTES.LOGIN),
      onError: () =>
        form.setError('root', { message: t('general.somethingWentWrong') }),
    })
  })

  return (
    <>
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <FormField label={t('general.name')} error={errors.name?.message}>
            <AppTextInput
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('auth.registerFullNamePlaceholder')}
              error={errors.name?.message}
            />
          </FormField>
        )}
      />

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

      <Controller
        control={control}
        name="passwordConfirmation"
        render={({ field }) => (
          <FormField
            label={t('auth.registerConfirmPassword')}
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
        label={t('auth.registerSubmit')}
        onPress={onSubmit}
        loading={isPending}
      />
    </>
  )
}

const styles = StyleSheet.create({
  rootError: { fontSize: 13, textAlign: 'center' },
})
