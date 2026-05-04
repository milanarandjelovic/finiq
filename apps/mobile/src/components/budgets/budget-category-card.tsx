import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import { calculateProgress, isOverBudget } from '@finiq/shared'
import { AppTextInput } from '@/components/ui/app-text-input'
import { Badge } from '@/components/ui/badge'
import { MutedText } from '@/components/ui/muted-text'
import { ProgressBar } from '@/components/ui/progress-bar'
import { SurfaceView } from '@/components/ui/surface-view'
import { Text } from '@/components/ui/text'
import { View } from '@/components/ui/view'
import { useCurrencyFormatter } from '@/hooks/use-currency-formatter'
import { Category } from '@/types/category'

export function BudgetCategoryCard({
  category,
  budgeted,
  spent,
  available,
  onBlur,
}: {
  category: Category
  budgeted: number
  spent: number
  available: number
  onBlur: (amount: number) => void
}) {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState(budgeted.toString())
  const format = useCurrencyFormatter()
  const over = isOverBudget(spent, budgeted)

  return (
    <SurfaceView style={styles.card}>
      <View style={[styles.cardHeader, { backgroundColor: 'transparent' }]}>
        <Text>
          {category.emoji} {category.name}
        </Text>
        {over && <Badge label={t('budget.overBudget')} variant="destructive" />}
      </View>

      <AppTextInput
        value={inputValue}
        onChangeText={setInputValue}
        onBlur={() => onBlur(parseFloat(inputValue) || 0)}
        keyboardType="decimal-pad"
        placeholder="0.00"
      />

      <ProgressBar
        value={calculateProgress(spent, budgeted)}
        color={category.color}
      />

      <View style={[styles.amounts, { backgroundColor: 'transparent' }]}>
        <MutedText>
          {t('budget.spent')} {format(spent)}
        </MutedText>
        <MutedText>
          {t('budget.available')} {format(available)}
        </MutedText>
      </View>
    </SurfaceView>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})
