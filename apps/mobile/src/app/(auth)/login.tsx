import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { LoginForm } from '@/components/auth/login-form'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/util/routes'

export default function LoginScreen() {
  const { t } = useTranslation()
  const router = useRouter()

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

          <LoginForm />

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
})
