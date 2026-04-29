import { type ReactNode } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { useThemeColor } from '@/hooks/use-theme-color'

interface ScreenHeaderProps {
  title: string
  rightElement?: ReactNode
}

export function ScreenHeader({ title, rightElement }: ScreenHeaderProps) {
  const text = useThemeColor('text')

  return (
    <View style={styles.row}>
      <Text style={[styles.title, { color: text }]}>{title}</Text>
      {rightElement ?? null}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: { fontSize: 22, fontWeight: '700' },
})
