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

import { RegisterForm } from '@/components/auth/register-form'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/util/routes'

export default function RegisterScreen() {
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
          <Text style={styles.title}>{t('auth.registerTitle')}</Text>

          <RegisterForm />

          <Button
            label={`${t('auth.registerHasAccount')} ${t('auth.loginSubmit')}`}
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
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
})
