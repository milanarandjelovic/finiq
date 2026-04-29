import { type PropsWithChildren } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { useTheme } from '@/hooks/use-theme'

interface FormFieldProps extends PropsWithChildren {
  label: string
  error?: string
}

export const FormField = ({ label, error, children }: FormFieldProps) => {
  const { colors } = useTheme()

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: colors.foreground }]}>{label}</Text>
      {children}
      {error ? (
        <Text style={[styles.error, { color: colors.destructive }]}>
          {error}
        </Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  label: { fontSize: 14, fontWeight: '500' },
  error: { fontSize: 12 },
})
