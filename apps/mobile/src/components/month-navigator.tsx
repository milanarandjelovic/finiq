import { Ionicons } from '@expo/vector-icons'
import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { useDateLocale } from '@/hooks/use-date-locale'
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
  const { t } = useTranslation()
  const locale = useDateLocale()
  const text = useThemeColor('text')

  return (
    <View style={styles.row}>
      <TouchableOpacity
        onPress={onPrev}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={t('monthPicker.previousMonth')}
      >
        <Ionicons name="chevron-back" size={20} color={text} />
      </TouchableOpacity>
      <Text style={[styles.label, { color: text }]}>
        {format(new Date(year, month - 1, 1), 'MMMM yyyy', { locale })}
      </Text>
      <TouchableOpacity
        onPress={onNext}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={t('monthPicker.nextMonth')}
      >
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
