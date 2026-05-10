import { Ionicons } from '@expo/vector-icons'
import { StyleSheet, TouchableOpacity } from 'react-native'

import { Text } from '@/components/ui/text'
import { View } from '@/components/ui/view'
import { useTheme } from '@/hooks/use-theme'
import type { Category } from '@/types/category'

export function CategoryRow({
  category,
  onEdit,
  onDelete,
}: {
  category: Category
  onEdit: () => void
  onDelete: () => void
}) {
  const { colors } = useTheme()

  return (
    <View
      style={[
        styles.row,
        {
          borderBottomColor: colors.border,
          borderLeftColor: category.color,
        },
      ]}
    >
      <Text style={styles.rowEmoji}>{category.emoji}</Text>
      <Text style={styles.rowName}>{category.name}</Text>
      <View style={styles.rowActions}>
        <TouchableOpacity
          onPress={onEdit}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Edit ${category.name}`}
        >
          <Ionicons
            name="pencil-outline"
            size={18}
            color={colors.mutedForeground}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onDelete}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Delete ${category.name}`}
        >
          <Ionicons
            name="trash-outline"
            size={18}
            color={colors.mutedForeground}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: 3,
    gap: 12,
  },
  rowEmoji: {
    fontSize: 20,
  },
  rowName: {
    flex: 1,
    fontSize: 15,
  },
  rowActions: {
    flexDirection: 'row',
    gap: 16,
  },
})
