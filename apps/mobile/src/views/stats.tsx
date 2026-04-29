import { useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

import { useMonthNavigation } from '@finiq/hooks'
import { MonthNavigator } from '@/components/month-navigator'
import { ScreenHeader } from '@/components/screen-header'
import { LoadingState } from '@/components/shared/loading-state'
import { SpendingBreakdownBar } from '@/components/stats/speding-breakdwn-bar'
import { TrendBarChart } from '@/components/stats/trend-bar-chart'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MutedText } from '@/components/ui/muted-text'
import { Screen } from '@/components/ui/screen'
import { SurfaceView } from '@/components/ui/surface-view'
import { useStatistics } from '@/hooks/data/use-statistics'
import { useCurrencyFormatter } from '@/hooks/use-currency-formatter'
import { useTheme } from '@/hooks/use-theme'

export default function StatsView() {
  const [tab, setTab] = useState<'category' | 'trend'>('category')
  const { year, month, prevMonth, nextMonth } = useMonthNavigation()
  const { data: statistics, isLoading } = useStatistics({ year, month })
  const format = useCurrencyFormatter()
  const { colors } = useTheme()

  return (
    <Screen>
      <ScreenHeader
        title="Statistics"
        rightElement={
          <MonthNavigator
            year={year}
            month={month}
            onPrev={prevMonth}
            onNext={nextMonth}
          />
        }
      />

      <View style={styles.tabs}>
        <Button
          label="By Category"
          variant={tab === 'category' ? 'primary' : 'ghost'}
          size="sm"
          onPress={() => setTab('category')}
        />
        <Button
          label="6-Month Trend"
          variant={tab === 'trend' ? 'primary' : 'ghost'}
          size="sm"
          onPress={() => setTab('trend')}
        />
      </View>

      {isLoading ? (
        <LoadingState />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {tab === 'category' && (
            <>
              {(statistics?.spendingByCategory ?? []).length > 0 && (
                <SpendingBreakdownBar data={statistics!.spendingByCategory} />
              )}
              {(statistics?.spendingByCategory ?? []).map((item) => (
                <SurfaceView key={item.categoryId} style={styles.categoryRow}>
                  <View
                    style={[styles.colorDot, { backgroundColor: item.color }]}
                  />
                  <Text style={styles.categoryName}>
                    {item.emoji} {item.name}
                  </Text>
                  <MutedText>{format(item.amount)}</MutedText>
                  <Badge
                    label={`${Math.round(item.percentage)}%`}
                    variant="secondary"
                  />
                </SurfaceView>
              ))}
            </>
          )}

          {tab === 'trend' && (
            <>
              <TrendBarChart data={statistics?.monthlyTrend ?? []} />
              <View style={styles.legend}>
                <View style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendDot,
                      { backgroundColor: colors.success },
                    ]}
                  />
                  <MutedText>Income</MutedText>
                </View>
                <View style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendDot,
                      { backgroundColor: colors.destructive },
                    ]}
                  />
                  <MutedText>Expenses</MutedText>
                </View>
              </View>
            </>
          )}
        </ScrollView>
      )}
    </Screen>
  )
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    gap: 8,
    padding: 16,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 10,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryName: {
    flex: 1,
    fontSize: 14,
  },
  legend: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
})
