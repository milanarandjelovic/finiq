import { useState } from 'react'
import { useRouter } from 'expo-router'
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

import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'
import { Button } from '@/components/ui/button'
import { MutedText } from '@/components/ui/muted-text'
import { ROUTES } from '@/util/routes'

export default function ForgotPasswordScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const [sentEmail, setSentEmail] = useState<string | null>(null)

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

          <ForgotPasswordForm onSuccess={(email) => setSentEmail(email)} />

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
})
