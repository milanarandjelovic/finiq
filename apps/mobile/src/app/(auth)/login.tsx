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

import { loginFormSchema, type LoginFormValues } from '@finiq/schemas'
import { AppTextInput } from '@/components/ui/app-text-input'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { useAuthSession } from '@/hooks/use-auth-session'
import { useTheme } from '@/hooks/use-theme'
import { ROUTES } from '@/util/routes'

export default function LoginScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const { login } = useAuthSession()
  const { colors } = useTheme()

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginFormSchema) })

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values)
      router.replace(ROUTES.DASHBOARD)
    } catch {
      setError('root', { message: t('errors.unauthorized') })
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
          <Text style={styles.title}>{t('auth.loginTitle')}</Text>

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

          {errors.root && (
            <Text style={[styles.rootError, { color: colors.destructive }]}>
              {errors.root.message}
            </Text>
          )}

          <Button
            label={t('auth.loginSubmit')}
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
          />

          <Button
            label={t('auth.loginForgotPassword')}
            variant="ghost"
            onPress={() => router.push(ROUTES.FORGOT_PASSWORD)}
          />

          <Button
            label={`${t('auth.loginNoAccount')} ${t('general.signUp')}`}
            variant="ghost"
            onPress={() => router.push(ROUTES.REGISTER)}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  rootError: {
    fontSize: 13,
    textAlign: 'center',
  },
})
