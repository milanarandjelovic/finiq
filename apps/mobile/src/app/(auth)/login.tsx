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

import { loginFormSchema, type LoginFormValues } from '@finiq/schemas'
import { AppTextInput } from '@/components/ui/app-text-input'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { useAuthSession } from '@/hooks/use-auth-session'
import { useTheme } from '@/hooks/use-theme'
import { routes } from '@/util/routes'

export default function LoginScreen() {
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
      router.replace(routes.dashboard)
    } catch {
      setError('root', { message: 'Invalid email or password.' })
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
          <Text style={styles.title}>Welcome back</Text>

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

          {errors.root && (
            <Text style={[styles.rootError, { color: colors.destructive }]}>
              {errors.root.message}
            </Text>
          )}

          <Button
            label="Log in"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
          />

          <Button
            label="Forgot password?"
            variant="ghost"
            onPress={() => router.push(routes.forgotPassword)}
          />

          <Button
            label="Don't have an account? Sign up"
            variant="ghost"
            onPress={() => router.push(routes.register)}
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
