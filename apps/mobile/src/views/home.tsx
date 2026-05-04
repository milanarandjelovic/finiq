import { ScrollView, StyleSheet, View } from 'react-native'

import { useMonthNavigation } from '@finiq/hooks'
import { calculateProgress } from '@finiq/shared'
import { SummaryCard } from '@/components/home/summary-card'
import { MonthNavigator } from '@/components/month-navigator'
import { ScreenHeader } from '@/components/screen-header'
import { LoadingState } from '@/components/shared/loading-state'
import { Badge } from '@/components/ui/badge'
import { MutedText } from '@/components/ui/muted-text'
import { ProgressBar } from '@/components/ui/progress-bar'
import { Screen } from '@/components/ui/screen'
import { SurfaceView } from '@/components/ui/surface-view'
import { Text } from '@/components/ui/text'
import { useDashboard } from '@/hooks/data/use-dashboard'
import { useCurrencyFormatter } from '@/hooks/use-currency-formatter'

export default function HomeView() {
  const { year, month, prevMonth, nextMonth } = useMonthNavigation()
  const { data: dashboard, isLoading } = useDashboard({ year, month })
  const format = useCurrencyFormatter()

  if (isLoading) {
    return (
      <Screen>
        <LoadingState count={5} />
      </Screen>
    )
  }

  return (
    <Screen>
      <ScrollView>
        <ScreenHeader
          title="Dashboard"
          rightElement={
            <MonthNavigator
              year={year}
              month={month}
              onPrev={prevMonth}
              onNext={nextMonth}
            />
          }
        />

        <View style={styles.grid}>
          <SummaryCard
            label="Income"
            value={format(dashboard?.totalIncome ?? 0)}
            color="#16a34a"
          />

          <SummaryCard
            label="Expenses"
            value={format(dashboard?.totalExpenses ?? 0)}
            color="#dc2626"
          />

          <SummaryCard
            label="Balance"
            value={format(dashboard?.balance ?? 0)}
            color={(dashboard?.balance ?? 0) >= 0 ? '#16a34a' : '#dc2626'}
          />

          <SummaryCard
            label="Ready to assign"
            value={format(dashboard?.readyToAssign ?? 0)}
            color="#eab308"
          />
        </View>

        <SurfaceView style={styles.card}>
          <Text style={styles.cardTitle}>Category breakdown</Text>
          {(dashboard?.categoryBreakdown ?? []).map((item) => (
            <View key={item.categoryId} style={styles.breakdownRow}>
              <View style={styles.breakdownHeader}>
                <Text>
                  {item.emoji} {item.name}
                </Text>
                {item.spent > item.budgeted && item.budgeted > 0 && (
                  <Badge label="Over budget" variant="destructive" />
                )}
              </View>
              <ProgressBar
                value={calculateProgress(item.spent, item.budgeted)}
                color={item.color}
              />
              <View style={styles.breakdownAmounts}>
                <MutedText>{format(item.spent)} spent</MutedText>
                <MutedText>of {format(item.budgeted)}</MutedText>
              </View>
            </View>
          ))}
        </SurfaceView>
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  card: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  breakdownRow: {
    gap: 4,
  },
  breakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})
