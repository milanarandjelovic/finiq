'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { MONTH_NAMES } from '@finiq/shared'
import { MonthPicker } from '@finiq/ui/components/month-picker'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@finiq/ui/components/tabs'
import type { StatisticsControllerGetStatistics200 } from '@/api/__generated__/models'
import { useStatisticsControllerGetStatistics } from '@/api/__generated__/statistics/statistics'
import { MonthlyTrendChart } from '@/app/(dashboard)/dashboard/stats/_components/chart/monthly-trend-chart'
import { SpendingPieChart } from '@/app/(dashboard)/dashboard/stats/_components/chart/spending-pie-chart'
import type { SpendingByCategoryItem } from '@/app/(dashboard)/dashboard/stats/_components/chart/spending-pie-chart'
import { SpendingBreakdown } from '@/app/(dashboard)/dashboard/stats/_components/spending-breakdown'

interface MonthlyTrendItem {
  month: number
  year: number
  income: number
  expenses: number
}

export default function StatsPage() {
  const { t } = useTranslation()
  const [date, setDate] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })

  const year = date.getFullYear()
  const month = date.getMonth() + 1

  const { data: statsResult, isLoading } = useStatisticsControllerGetStatistics(
    { year, month },
    { query: { queryKey: ['statistics', year, month] } },
  )

  const data = (
    statsResult?.data as StatisticsControllerGetStatistics200 | undefined
  )?.data?.statistics as
    | {
        spendingByCategory: SpendingByCategoryItem[]
        monthlyTrend: MonthlyTrendItem[]
      }
    | undefined

  const trendData = (data?.monthlyTrend ?? []).map((item) => ({
    name: `${MONTH_NAMES[item.month - 1]} ${item.year}`,
    income: Number(item.income),
    expenses: Number(item.expenses),
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t('statistics.title')}</h1>
        <MonthPicker value={date} onChange={setDate} />
      </div>

      <Tabs defaultValue="categories">
        <TabsList>
          <TabsTrigger value="categories">
            {t('statistics.byCategory')}
          </TabsTrigger>
          <TabsTrigger value="trend">
            {t('statistics.sixMonthTrend')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="mt-4">
          <div className="grid gap-6 md:grid-cols-2">
            <SpendingPieChart
              data={data?.spendingByCategory}
              isLoading={isLoading}
            />

            <SpendingBreakdown
              data={data?.spendingByCategory}
              isLoading={isLoading}
            />
          </div>
        </TabsContent>

        <TabsContent value="trend" className="mt-4">
          <MonthlyTrendChart data={trendData} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
