import { StyleSheet, TouchableOpacity, View } from 'react-native'

import { useTheme } from '@/hooks/use-theme'

export const PRESET_COLORS = [
  '#6366f1',
  '#f43f5e',
  '#f59e0b',
  '#10b981',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
]

interface ColorPresetPickerProps {
  selected: string
  onSelect: (color: string) => void
}

export function ColorPresetPicker({
  selected,
  onSelect,
}: ColorPresetPickerProps) {
  const { colors } = useTheme()

  return (
    <View style={styles.row}>
      {PRESET_COLORS.map((c) => (
        <TouchableOpacity
          key={c}
          onPress={() => onSelect(c)}
          accessibilityRole="button"
          accessibilityLabel={`Select color ${c}`}
          accessibilityState={{ selected: selected === c }}
          style={[
            styles.swatch,
            { backgroundColor: c },
            selected === c && {
              borderWidth: 3,
              borderColor: colors.card,
              opacity: 0.9,
            },
          ]}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  swatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
})
