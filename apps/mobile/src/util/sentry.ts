import {
  createSentryConfig,
  isSentryEnabled,
  toSentryInitOptions,
} from '@finiq/sentry'
import * as Sentry from '@sentry/react-native'
import { isRunningInExpoGo } from 'expo'
import Constants from 'expo-constants'

export function initSentry(
  navigationIntegration: ReturnType<typeof Sentry.reactNavigationIntegration>,
) {
  const { sentryEnableLogs, sentryProfileLifecycle, sentrySendDefaultPii } =
    Constants.expoConfig?.extra ?? {}

  const config = createSentryConfig({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    enabled: process.env.EXPO_PUBLIC_SENTRY_ENABLED === 'true',
    environment: process.env.EXPO_PUBLIC_APP_ENV ?? 'development',
    release: process.env.EXPO_PUBLIC_SENTRY_RELEASE,
    tracesSampleRate: parseFloat(
      process.env.EXPO_PUBLIC_SENTRY_TRACES_SAMPLE_RATE || '0.1',
    ),
    enableLogs: sentryEnableLogs,
    profileLifecycle: sentryProfileLifecycle,
    sendDefaultPii: sentrySendDefaultPii,
  })

  if (!isSentryEnabled(config)) {
    return
  }

  Sentry.init({
    ...toSentryInitOptions(config),
    integrations: [navigationIntegration],
    enableNativeFramesTracking: !isRunningInExpoGo(),
  })
}
