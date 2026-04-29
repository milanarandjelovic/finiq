import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'
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
import { useTheme } from '@/hooks/use-theme'
import { FiniqAPI } from '@/network/api'
import { routes } from '@/util/routes'

export default function RegisterScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerFormSchema) })

  const onSubmit = async (values: RegisterFormValues) => {
    const { passwordConfirmation: _, ...payload } = values
    try {
      await FiniqAPI.auth.register(payload)
      router.replace(routes.login)
    } catch {
      setError('root', { message: 'Registration failed. Please try again.' })
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
          <Text style={styles.title}>Create account</Text>

          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <FormField label="Name" error={errors.name?.message}>
                <AppTextInput
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholder="Your name"
                  error={errors.name?.message}
                />
              </FormField>
            )}
          />

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

          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormField label="Password" error={errors.password?.message}>
                <AppTextInput
                  value={field.value}
                  onChangeText={field.onChange}
                  secureTextEntry
                  placeholder="••••••••"
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
                label="Confirm password"
                error={errors.passwordConfirmation?.message}
              >
                <AppTextInput
                  value={field.value}
                  onChangeText={field.onChange}
                  secureTextEntry
                  placeholder="••••••••"
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
            label="Create account"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
          />

          <Button
            label="Already have an account? Log in"
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
