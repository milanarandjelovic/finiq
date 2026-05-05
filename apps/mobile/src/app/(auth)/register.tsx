import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { registerFormSchema, type RegisterFormValues } from '@finiq/schemas'
import { AppTextInput } from '@/components/ui/app-text-input'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { useRegister } from '@/hooks/auth/use-register'
import { useTheme } from '@/hooks/use-theme'
import { routes } from '@/util/routes'

export default function RegisterScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const { colors } = useTheme()
  const { mutateAsync: register, isPending } = useRegister()

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerFormSchema) })

  const onSubmit = async (values: RegisterFormValues) => {
    const { passwordConfirmation: _, ...payload } = values
    try {
      await register(payload)
      router.replace(routes.login)
    } catch {
      setError('root', { message: t('general.somethingWentWrong') })
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>{t('auth.registerTitle')}</Text>

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
              <FormField
                label={t('general.email')}
                error={errors.email?.message}
              >
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
            onPress={handleSubmit(onSubmit)}
            loading={isPending}
          />

          <Button
            label={`${t('auth.registerHasAccount')} ${t('auth.loginSubmit')}`}
            variant="ghost"
            onPress={() => router.replace(routes.login)}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { padding: 24, gap: 16 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  rootError: { fontSize: 13, textAlign: 'center' },
})
