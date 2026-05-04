import { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  View,
} from 'react-native'

import { CategoryRow } from '@/components/categories/category-row'
import { CategorySheet } from '@/components/categories/category-sheet'
import { ScreenHeader } from '@/components/screen-header'
import { EmptyState } from '@/components/shared/empty-state'
import { LoadingState } from '@/components/shared/loading-state'
import { AppTextInput } from '@/components/ui/app-text-input'
import { Button } from '@/components/ui/button'
import { Screen } from '@/components/ui/screen'
import { useCategoriesInfinite } from '@/hooks/data/use-categories-infinite'
import { useCategoryDelete } from '@/hooks/data/use-category-delete'
import type { Category } from '@/types/category'

export default function CategoriesView() {
  const [search, setSearch] = useState('')
  const [createVisible, setCreateVisible] = useState(false)
  const [editTarget, setEditTarget] = useState<Category | null>(null)

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useCategoriesInfinite({ isGoal: 0, name: search || undefined })

  const { mutate: deleteCategory } = useCategoryDelete()

  const categories = data?.pages.flatMap((p) => p?.data ?? []) ?? []

  return (
    <Screen>
      <ScreenHeader
        title="Categories"
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
          data={categories}
          keyExtractor={(c) => c.id}
          ListEmptyComponent={<EmptyState message="No categories found." />}
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
            <CategoryRow
              category={item}
              onEdit={() => setEditTarget(item)}
              onDelete={() =>
                Alert.alert(
                  'Delete Category',
                  'Are you sure you want to delete this category?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: () => deleteCategory(item.id),
                    },
                  ],
                )
              }
            />
          )}
        />
      )}

      <CategorySheet
        visible={createVisible}
        onClose={() => setCreateVisible(false)}
      />

      <CategorySheet
        visible={!!editTarget}
        onClose={() => setEditTarget(null)}
        categoryId={editTarget?.id}
        defaultValues={
          editTarget
            ? {
                name: editTarget.name,
                emoji: editTarget.emoji,
                color: editTarget.color,
                budgetAmount: editTarget.budgetAmount,
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
  footer: {
    paddingVertical: 16,
  },
})
