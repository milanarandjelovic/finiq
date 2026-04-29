import { useMemo, useState } from 'react'
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native'

import { GoalCard } from '@/components/goals/goal-card'
import { GoalSheet } from '@/components/goals/goal-sheet'
import { ScreenHeader } from '@/components/screen-header'
import { EmptyState } from '@/components/shared/empty-state'
import { LoadingState } from '@/components/shared/loading-state'
import { AppTextInput } from '@/components/ui/app-text-input'
import { Button } from '@/components/ui/button'
import { Screen } from '@/components/ui/screen'
import { useCategoriesInfinite } from '@/hooks/data/use-categories-infinite'
import { useCategoryDelete } from '@/hooks/data/use-category-delete'
import { useTransactionsAll } from '@/hooks/data/use-transactions-all'
import { useCurrencyFormatter } from '@/hooks/use-currency-formatter'
import type { Category } from '@/types/category'

export default function GoalsView() {
  const [search, setSearch] = useState('')
  const [createVisible, setCreateVisible] = useState(false)
  const [editTarget, setEditTarget] = useState<Category | null>(null)

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useCategoriesInfinite({ isGoal: 1, name: search || undefined })

  const { data: transactions = [] } = useTransactionsAll()
  const { mutate: deleteGoal } = useCategoryDelete()
  const format = useCurrencyFormatter()

  const goals = data?.pages.flatMap((p) => p?.data ?? []) ?? []

  const savedByGoal = useMemo(() => {
    const map = new Map<string, number>()
    transactions.forEach((t) => {
      if (t.type === 'expense' && t.category) {
        map.set(t.category.id, (map.get(t.category.id) ?? 0) + t.amount)
      }
    })

    return map
  }, [transactions])

  return (
    <Screen>
      <ScreenHeader
        title="Goals"
        rightElement={
          <Button
            label="Add"
            size="sm"
            onPress={() => setCreateVisible(true)}
          />
        }
      />

      <View style={styles.searchContainer}>
        <AppTextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search by name..."
          style={styles.search}
        />
      </View>

      {isLoading ? (
        <LoadingState />
      ) : (
        <FlatList
          data={goals}
          keyExtractor={(g) => g.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<EmptyState message="No goals found." />}
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
            <GoalCard
              goal={item}
              saved={savedByGoal.get(item.id) ?? 0}
              format={format}
              onEdit={() => setEditTarget(item)}
              onDelete={() => deleteGoal(item.id)}
            />
          )}
        />
      )}

      <GoalSheet
        visible={createVisible}
        onClose={() => setCreateVisible(false)}
      />

      <GoalSheet
        visible={!!editTarget}
        onClose={() => setEditTarget(null)}
        goalId={editTarget?.id}
        defaultValues={
          editTarget
            ? {
                name: editTarget.name,
                emoji: editTarget.emoji,
                color: editTarget.color,
                targetAmount: editTarget.targetAmount ?? undefined,
                targetDate: editTarget.targetDate ?? undefined,
              }
            : undefined
        }
      />
    </Screen>
  )
}

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  search: {
    paddingVertical: 10,
  },
  list: {
    padding: 16,
    gap: 12,
  },
  footer: {
    paddingVertical: 16,
  },
})
