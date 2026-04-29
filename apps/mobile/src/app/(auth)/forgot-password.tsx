import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'
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
import { useTheme } from '@/hooks/use-theme'
import { FiniqAPI } from '@/network/api'
import { routes } from '@/util/routes'

export default function ForgotPasswordScreen() {
  const router = useRouter()
  const { colors } = useTheme()
  const [sentEmail, setSentEmail] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordFormSchema),
  })

  const onSubmit = async ({ email }: ForgotPasswordFormValues) => {
    try {
      await FiniqAPI.auth.forgotPassword({ email })
      setSentEmail(email)
    } catch {
      setError('root', { message: 'Something went wrong. Please try again.' })
    }
  }

  if (sentEmail) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.center}>
          <Text style={styles.title}>Check your inbox</Text>
          <MutedText>We sent a reset link to {sentEmail}</MutedText>
          <Button
            label="Back to login"
            variant="outline"
            onPress={() => router.replace(routes.login)}
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
          <Text style={styles.title}>Forgot password</Text>
          <MutedText>
            Enter your email and we&apos;ll send you a reset link.
          </MutedText>

          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormField label="Email" error={errors.email?.message}>
                <AppTextInput
                  value={field.value}
                  onChangeText={field.onChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="you@example.com"
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
            label="Send reset link"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
          />

          <Button
            label="Back to login"
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
