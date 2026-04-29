import { Ionicons } from '@expo/vector-icons'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { MONTH_NAMES } from '@finiq/shared'
import { useThemeColor } from '@/hooks/use-theme-color'

interface MonthNavigatorProps {
  year: number
  month: number // 1-based
  onPrev: () => void
  onNext: () => void
}

export function MonthNavigator({
  year,
  month,
  onPrev,
  onNext,
}: MonthNavigatorProps) {
  const text = useThemeColor('text')

  return (
    <View style={styles.row}>
      <TouchableOpacity onPress={onPrev} hitSlop={8}>
        <Ionicons name="chevron-back" size={20} color={text} />
      </TouchableOpacity>
      <Text style={[styles.label, { color: text }]}>
        {MONTH_NAMES[month - 1]} {year}
      </Text>
      <TouchableOpacity onPress={onNext} hitSlop={8}>
        <Ionicons name="chevron-forward" size={20} color={text} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    minWidth: 120,
    textAlign: 'center',
  },
})
