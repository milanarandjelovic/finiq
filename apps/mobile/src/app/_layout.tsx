import { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import { I18nextProvider } from 'react-i18next'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import 'react-native-reanimated'

import i18n, { changeLanguage, detectUserLanguage } from '@/i18n'
import { AuthProvider } from '@/providers/auth-provider'
import { ThemeProvider } from '@/providers/theme-provider'

export const reactQueryClient = new QueryClient()

function RootNavigator() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" />
    </Stack>
  )
}

export default function RootLayout() {
  const [i18nReady, setI18nReady] = useState(false)

  useEffect(() => {
    detectUserLanguage()
      .then((lang) => changeLanguage(lang))
      .finally(() => setI18nReady(true))
  }, [])

  if (!i18nReady) {
    return null
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <I18nextProvider i18n={i18n}>
          <AuthProvider>
            <QueryClientProvider client={reactQueryClient}>
              <RootNavigator />
            </QueryClientProvider>
          </AuthProvider>
        </I18nextProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
