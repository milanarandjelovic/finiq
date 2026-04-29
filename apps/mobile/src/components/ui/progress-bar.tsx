import { StyleSheet, View } from 'react-native'

import { useThemeColor } from '@/hooks/use-theme-color'

interface ProgressBarProps {
  value: number // 0–100
  color?: string
  height?: number
}

export function ProgressBar({ value, color, height = 6 }: ProgressBarProps) {
  const surface = useThemeColor('surface')
  const primary = useThemeColor('primary')

  return (
    <View style={[styles.track, { height, backgroundColor: surface }]}>
      <View
        style={[
          styles.fill,
          {
            width: `${Math.min(100, Math.max(0, value))}%`,
            height,
            backgroundColor: color ?? primary,
          },
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  track: { borderRadius: 99, overflow: 'hidden', width: '100%' },
  fill: { borderRadius: 99 },
})
