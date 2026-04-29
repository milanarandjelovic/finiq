import { StyleSheet, View } from 'react-native'

import type { SpendingByCategoryItem } from '@/types/statistics'

export function SpendingBreakdownBar({
  data,
}: {
  data: SpendingByCategoryItem[]
}) {
  return (
    <View style={styles.breakdownBar}>
      {data.map((item) => (
        <View
          key={item.categoryId}
          style={{ flex: item.percentage, backgroundColor: item.color }}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  breakdownBar: {
    flexDirection: 'row',
    height: 28,
    borderRadius: 8,
    overflow: 'hidden',
  },
})
