import { StyleSheet, Text, View } from 'react-native'

import { useThemeColor } from '@/hooks/use-theme-color'

export function EmptyState({ message }: { message: string }) {
  const muted = useThemeColor('muted')
  return (
    <View style={styles.wrapper}>
      <Text style={[styles.text, { color: muted }]}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  text: {
    fontSize: 15,
    textAlign: 'center',
  },
})
