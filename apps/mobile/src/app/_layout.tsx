import { useEffect, useState } from 'react'
import * as Sentry from '@sentry/react-native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { isRunningInExpoGo } from 'expo'
import { Stack, useNavigationContainerRef } from 'expo-router'
import { I18nextProvider } from 'react-i18next'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import 'react-native-reanimated'

import i18n, { changeLanguage, detectUserLanguage } from '@/i18n'
import { AuthProvider } from '@/providers/auth-provider'
import { ThemeProvider } from '@/providers/theme-provider'
import { initSentry } from '@/util/sentry'

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo(),
})

initSentry(navigationIntegration)

export { ErrorBoundary } from '@/components/shared/error-boundary'

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

function RootLayout() {
  const ref = useNavigationContainerRef()
  const [i18nReady, setI18nReady] = useState(false)

  useEffect(() => {
    if (ref?.current) {
      navigationIntegration.registerNavigationContainer(ref)
    }
  }, [ref])

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

/**
 * Sentry.wrap() installs the React error boundary and is required
 * for native crash capture
 */
export default Sentry.wrap(RootLayout)
