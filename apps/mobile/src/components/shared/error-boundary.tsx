import { useEffect } from 'react'
import * as Sentry from '@sentry/react-native'
import { ErrorBoundaryProps } from 'expo-router'
import { ServerCrash } from 'lucide-react-native'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native'

import i18n from '@/i18n'

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  const scheme = useColorScheme() ?? 'light'
  const isDark = scheme === 'dark'

  const bg = isDark ? '#000000' : '#ffffff'
  const fg = isDark ? '#ffffff' : '#000000'
  const muted = isDark ? '#a1a1aa' : '#71717a'
  const destructive = isDark ? '#f2555a' : '#e5484d'
  const destructiveBg = isDark ? 'rgba(242,85,90,0.12)' : 'rgba(229,72,77,0.1)'
  const border = isDark ? '#27272a' : '#e4e4e7'

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <View style={[styles.iconWrapper, { backgroundColor: destructiveBg }]}>
        <ServerCrash size={40} color={destructive} />
      </View>
      <Text style={[styles.title, { color: fg }]}>
        {i18n.t('general.somethingWentWrong')}
      </Text>
      {!!error.message && (
        <Text style={[styles.message, { color: muted }]}>{error.message}</Text>
      )}
      <TouchableOpacity
        onPress={retry}
        style={[styles.button, { borderColor: border }]}
        activeOpacity={0.7}
      >
        <Text style={[styles.buttonText, { color: fg }]}>
          {i18n.t('general.tryAgain')}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 24,
  },
  iconWrapper: {
    padding: 16,
    borderRadius: 9999,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  message: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  button: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
  },
})
