import { zodResolver } from '@hookform/resolvers/zod'
import { useLocalSearchParams, useRouter } from 'expo-router'
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

import {
  resetPasswordFormSchema,
  type ResetPasswordFormValues,
} from '@finiq/schemas'
import { AppTextInput } from '@/components/ui/app-text-input'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { useTheme } from '@/hooks/use-theme'
import { FiniqAPI } from '@/network/api'
import { routes } from '@/util/routes'

export default function ResetPasswordScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const { colors } = useTheme()
  const { token } = useLocalSearchParams<{ token: string }>()

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordFormSchema),
  })

  const onSubmit = async (values: ResetPasswordFormValues) => {
    try {
      await FiniqAPI.auth.resetPassword({ ...values, token })
      router.replace(routes.login)
    } catch {
      setError('root', {
        message: t('general.somethingWentWrong'),
      })
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
          <Text style={styles.title}>{t('auth.resetPasswordTitle')}</Text>

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
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
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
