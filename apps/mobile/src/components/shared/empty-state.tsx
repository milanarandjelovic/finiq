import { StyleSheet, Text } from 'react-native'

import { SurfaceView } from '@/components/ui/surface-view'
import { useThemeColor } from '@/hooks/use-theme-color'

export function EmptyState({ message }: { message: string }) {
  const muted = useThemeColor('muted')
  return (
    <SurfaceView style={styles.wrapper}>
      <Text style={[styles.text, { color: muted }]}>{message}</Text>
    </SurfaceView>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  text: {
    fontSize: 15,
    textAlign: 'center',
  },
})
