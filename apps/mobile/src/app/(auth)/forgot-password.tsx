import { useState } from 'react'
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
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import {
  forgotPasswordFormSchema,
  type ForgotPasswordFormValues,
} from '@finiq/schemas'
import { AppTextInput } from '@/components/ui/app-text-input'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { MutedText } from '@/components/ui/muted-text'
import { useForgotPassword } from '@/hooks/auth/use-forgot-password'
import { useTheme } from '@/hooks/use-theme'
import { ROUTES } from '@/util/routes'

export default function ForgotPasswordScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const { colors } = useTheme()
  const [sentEmail, setSentEmail] = useState<string | null>(null)
  const { mutateAsync: forgotPassword, isPending } = useForgotPassword()

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordFormSchema),
  })

  const onSubmit = async ({ email }: ForgotPasswordFormValues) => {
    try {
      await forgotPassword({ email })
      setSentEmail(email)
    } catch {
      setError('root', { message: t('general.somethingWentWrong') })
    }
  }

  if (sentEmail) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.center}>
          <Text style={styles.title}>
            {t('auth.forgotPasswordCheckEmailTitle')}
          </Text>
          <MutedText>
            {t('auth.forgotPasswordCheckEmailDescription')} {sentEmail}
          </MutedText>
          <Button
            label={t('auth.forgotPasswordBackToSignIn')}
            variant="outline"
            onPress={() => router.replace(ROUTES.LOGIN)}
          />
        </View>
      </SafeAreaView>
    )
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
          <Text style={styles.title}>{t('auth.forgotPasswordTitle')}</Text>
          <MutedText>{t('auth.forgotPasswordDescription')}</MutedText>

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

          {errors.root && (
            <Text style={[styles.rootError, { color: colors.destructive }]}>
              {errors.root.message}
            </Text>
          )}

          <Button
            label={t('auth.forgotPasswordSubmit')}
            onPress={handleSubmit(onSubmit)}
            loading={isPending}
          />

          <Button
            label={t('auth.forgotPasswordBackToSignIn')}
            variant="ghost"
            onPress={() => router.replace(ROUTES.LOGIN)}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { padding: 24, gap: 16 },
  center: {
    flex: 1,
    padding: 24,
    gap: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  rootError: { fontSize: 13, textAlign: 'center' },
})
