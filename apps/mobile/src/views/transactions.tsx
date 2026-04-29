import { useState } from 'react'
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native'

import { useMonthNavigation } from '@finiq/hooks'
import { MonthNavigator } from '@/components/month-navigator'
import { ScreenHeader } from '@/components/screen-header'
import { EmptyState } from '@/components/shared/empty-state'
import { LoadingState } from '@/components/shared/loading-state'
import { AddTransactionSheet } from '@/components/transactions/add-transaction-sheet'
import { TransactionRow } from '@/components/transactions/transaction-row'
import { Button } from '@/components/ui/button'
import { Screen } from '@/components/ui/screen'
import { useCategories } from '@/hooks/data/use-categories'
import { useTransactionDelete } from '@/hooks/data/use-transaction-delete'
import { useTransactions } from '@/hooks/data/use-transactions'
import { useCurrencyFormatter } from '@/hooks/use-currency-formatter'
import type { TransactionType } from '@/types/transaction'

export default function TransactionsView() {
  const [typeFilter, setTypeFilter] = useState<TransactionType | undefined>()
  const [addVisible, setAddVisible] = useState(false)
  const { year, month, prevMonth, nextMonth } = useMonthNavigation()
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useTransactions({ year, month, type: typeFilter })
  const { data: categories = [] } = useCategories()
  const { mutate: deleteTransaction } = useTransactionDelete()
  const format = useCurrencyFormatter()

  const transactions = data?.pages.flatMap((p) => p?.data ?? []) ?? []

  return (
    <Screen>
      <ScreenHeader
        title="Transactions"
        rightElement={
          <Button label="Add" size="sm" onPress={() => setAddVisible(true)} />
        }
      />

      <View style={styles.filters}>
        <MonthNavigator
          year={year}
          month={month}
          onPrev={prevMonth}
          onNext={nextMonth}
        />
        <View style={styles.segment}>
          {[
            { label: 'All', value: undefined },
            { label: 'Income', value: 'income' as const },
            { label: 'Expense', value: 'expense' as const },
          ].map((opt) => (
            <Button
              key={opt.label}
              label={opt.label}
              variant={typeFilter === opt.value ? 'primary' : 'ghost'}
              size="sm"
              onPress={() => setTypeFilter(opt.value)}
            />
          ))}
        </View>
      </View>

      {isLoading ? (
        <LoadingState />
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(t) => t.id}
          ListEmptyComponent={
            <EmptyState message="No transactions this month." />
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator style={styles.footer} />
            ) : null
          }
          onEndReachedThreshold={0.3}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage()
          }}
          renderItem={({ item }) => (
            <TransactionRow
              transaction={item}
              format={format}
              onDelete={() => deleteTransaction(item.id)}
            />
          )}
        />
      )}

      <AddTransactionSheet
        visible={addVisible}
        onClose={() => setAddVisible(false)}
        categories={categories.filter((c) => !c.isGoal)}
      />
    </Screen>
  )
}

const styles = StyleSheet.create({
  filters: {
    padding: 16,
    gap: 12,
  },
  segment: {
    flexDirection: 'row',
    gap: 4,
  },
  footer: {
    paddingVertical: 16,
  },
})
