import { Link, Stack } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'

import { useTheme } from '@/hooks/use-theme'
import { routes } from '@/util/routes'

export default function NotFoundScreen() {
  const { t } = useTranslation()
  const { colors } = useTheme()

  return (
    <>
      <Stack.Screen options={{ title: t('notFound.title') }} />
      <View style={styles.container}>
        <Text style={styles.title}>{t('notFound.description')}</Text>
        <Link href={routes.index} style={styles.link}>
          <Text style={[styles.linkText, { color: colors.primary }]}>
            {t('notFound.goHome')}
          </Text>
        </Link>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
  },
})
