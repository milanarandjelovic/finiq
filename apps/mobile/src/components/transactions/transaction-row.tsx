import { Ionicons } from '@expo/vector-icons'
import { StyleSheet, TouchableOpacity } from 'react-native'

import { Text } from '@/components/ui/text'
import { View } from '@/components/ui/view'
import { useTheme } from '@/hooks/use-theme'
import type { Transaction } from '@/types/transaction'

export function TransactionRow({
  transaction,
  format,
  onDelete,
}: {
  transaction: Transaction
  format: (amount: number) => string
  onDelete: () => void
}) {
  const { colors } = useTheme()
  const isIncome = transaction.type === 'income'

  return (
    <View
      style={[
        styles.row,
        { borderBottomColor: colors.border, backgroundColor: 'transparent' },
      ]}
    >
      <View style={[styles.rowLeft]}>
        <Text style={[styles.rowDate, { color: colors.mutedForeground }]}>
          {transaction.date}
        </Text>
        {transaction.category && (
          <Text style={styles.rowCategory}>
            {transaction.category.emoji} {transaction.category.name}
          </Text>
        )}
        {transaction.note && (
          <Text
            style={[styles.rowNote, { color: colors.mutedForeground }]}
            numberOfLines={1}
          >
            {transaction.note}
          </Text>
        )}
      </View>
      <View style={styles.rowRight}>
        <Text
          style={[
            styles.rowAmount,
            { color: isIncome ? colors.success : colors.destructive },
          ]}
        >
          {isIncome ? '+' : '-'}
          {format(transaction.amount)}
        </Text>
        <TouchableOpacity onPress={onDelete} hitSlop={8}>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLeft: {
    gap: 2,
    flex: 1,
    backgroundColor: 'transparent',
  },
  rowDate: {
    fontSize: 12,
  },
  rowCategory: {
    fontSize: 14,
    fontWeight: '500',
  },
  rowNote: {
    fontSize: 12,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'transparent',
  },
  rowAmount: {
    fontSize: 15,
    fontWeight: '600',
  },
})
