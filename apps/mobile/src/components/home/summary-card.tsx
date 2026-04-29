import { StyleSheet, Text } from 'react-native'

import { MutedText } from '@/components/ui/muted-text'
import { SurfaceView } from '@/components/ui/surface-view'

export function SummaryCard({
  label,
  value,
  color,
}: {
  label: string
  value: string
  color?: string
}) {
  return (
    <SurfaceView style={styles.summaryCard}>
      <MutedText style={styles.summaryLabel}>{label}</MutedText>
      <Text style={[styles.summaryValue, color ? { color } : undefined]}>
        {value}
      </Text>
    </SurfaceView>
  )
}

const styles = StyleSheet.create({
  summaryCard: {
    flex: 1,
    minWidth: '45%',
    padding: 12,
    borderRadius: 10,
    gap: 4,
  },
  summaryLabel: {
    fontSize: 12,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
  },
})
