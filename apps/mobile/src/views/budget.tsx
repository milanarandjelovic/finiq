import { ActivityIndicator, FlatList, StyleSheet } from 'react-native'

import { useMonthNavigation } from '@finiq/hooks'
import { BudgetCategoryCard } from '@/components/budgets/budget-category-card'
import { MonthNavigator } from '@/components/month-navigator'
import { ScreenHeader } from '@/components/screen-header'
import { EmptyState } from '@/components/shared/empty-state'
import { LoadingState } from '@/components/shared/loading-state'
import { Button } from '@/components/ui/button'
import { Screen } from '@/components/ui/screen'
import { useBudgetCopy } from '@/hooks/data/use-budget-copy'
import { useBudgetUpsert } from '@/hooks/data/use-budget-upsert'
import { useBudgets } from '@/hooks/data/use-budgets'
import { useDashboard } from '@/hooks/data/use-dashboard'

export default function BudgetView() {
  const { year, month, prevMonth, nextMonth } = useMonthNavigation()
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useBudgets({ year, month })
  const { data: dashboard } = useDashboard({ year, month })
  const { mutate: upsert } = useBudgetUpsert()
  const { mutate: copy, isPending: copying } = useBudgetCopy()

  const budgets = data?.pages.flatMap((p) => p?.data ?? []) ?? []

  const getSpent = (categoryId: string) =>
    dashboard?.categoryBreakdown.find((b) => b.categoryId === categoryId)
      ?.spent ?? 0

  return (
    <Screen>
      <ScreenHeader
        title="Budget"
        rightElement={
          <MonthNavigator
            year={year}
            month={month}
            onPrev={prevMonth}
            onNext={nextMonth}
          />
        }
      />

      {isLoading ? (
        <LoadingState />
      ) : (
        <FlatList
          data={budgets}
          keyExtractor={(b) => b.id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <Button
              label="Copy prev month"
              variant="outline"
              loading={copying}
              onPress={() => copy({ year, month })}
            />
          }
          ListEmptyComponent={<EmptyState message="No budgets this month." />}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator style={styles.footer} />
            ) : null
          }
          onEndReachedThreshold={0.3}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage()
            }
          }}
          renderItem={({ item }) => {
            const spent = getSpent(item.category.id)
            return (
              <BudgetCategoryCard
                category={item.category}
                budgeted={item.amount}
                spent={spent}
                available={item.amount - spent}
                onBlur={(amount) =>
                  upsert({ categoryId: item.category.id, year, month, amount })
                }
              />
            )
          }}
        />
      )}
    </Screen>
  )
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
    gap: 12,
  },
  footer: {
    paddingVertical: 16,
  },
})
