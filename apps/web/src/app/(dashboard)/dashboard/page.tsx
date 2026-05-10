'use client'

import { useTranslation } from 'react-i18next'

import { useMonthNavigation } from '@finiq/hooks'
import { calculateProgress, isOverBudget } from '@finiq/shared'
import { Badge } from '@finiq/ui/components/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@finiq/ui/components/card'
import { Progress } from '@finiq/ui/components/progress'
import { Skeleton } from '@finiq/ui/components/skeleton'
import { cn } from '@finiq/ui/lib/utils'
import { useDashboardControllerGetDashboard } from '@/api/__generated__/dashboard/dashboard'
import type { DashboardControllerGetDashboard200 } from '@/api/__generated__/models'
import { SummaryCard } from '@/app/(dashboard)/dashboard/transactions/_components/summary-card'
import { MonthPicker } from '@/components/shared/month-picker'
import { QueryError } from '@/components/shared/query-error'
import { useCurrencyFormatter } from '@/hooks/use-currency-formatter'
import { unwrapApiResponse } from '@/lib/api-response'

export default function DashboardPage() {
  const { t } = useTranslation()
  const formatCurrency = useCurrencyFormatter()
  const { year, month, date, setDate } = useMonthNavigation()

  const {
    data: dashboardResult,
    isLoading,
    isError,
    refetch,
  } = useDashboardControllerGetDashboard(
    { year, month },
    { query: { queryKey: ['dashboard', year, month] } },
  )

  const data = unwrapApiResponse<DashboardControllerGetDashboard200>(
    dashboardResult?.data,
  )?.data?.dashboard

  if (isError) {
    return <QueryError onRetry={refetch} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            {t('dashboard.overview')}
          </h1>
          <p className="text-muted-foreground text-sm">
            {t('dashboard.overviewDescription')}
          </p>
        </div>
        <MonthPicker value={date} onChange={setDate} />
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="gap-3">
              <CardHeader className="pb-0">
                <Skeleton className="h-3.5 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 w-28" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <SummaryCard
              label={t('dashboard.income')}
              value={data?.totalIncome ?? 0}
              variant="income"
              formatCurrency={formatCurrency}
            />

            <SummaryCard
              label={t('dashboard.expenses')}
              value={data?.totalExpenses ?? 0}
              variant="expense"
              formatCurrency={formatCurrency}
            />

            <SummaryCard
              label={t('dashboard.balance')}
              value={data?.balance ?? 0}
              variant="balance"
              formatCurrency={formatCurrency}
            />

            <SummaryCard
              label={t('dashboard.readyToAssign')}
              value={data?.readyToAssign ?? 0}
              variant="assign"
              formatCurrency={formatCurrency}
            />
          </>
        )}
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-medium">
            {t('dashboard.categoryBreakdown')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <Skeleton className="h-3.5 w-36" />
                <Skeleton className="h-1.5 w-full" />
              </div>
            ))
          ) : data?.categoryBreakdown.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center text-sm">
              {t('dashboard.noCategoriesYet')}
            </p>
          ) : (
            data?.categoryBreakdown.map((item) => {
              const pct = calculateProgress(item.spent, item.budgeted)
              const isOver = isOverBudget(item.spent, item.budgeted)
              return (
                <div key={item.categoryId} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span
                        className="inline-block size-2 shrink-0 rounded-full"
                        style={{ backgroundColor: item.color || '#94a3b8' }}
                      />
                      <span>{item.emoji}</span>
                      <span className="font-medium">{item.name}</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground tabular-nums">
                        {formatCurrency(item.spent)} /{' '}
                        {formatCurrency(item.budgeted)}
                      </span>
                      {isOver && (
                        <Badge
                          variant="destructive"
                          className="h-5 px-1.5 text-xs"
                        >
                          {t('dashboard.over')}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Progress
                    value={pct}
                    className={cn(
                      'h-1.5',
                      isOver ? '[&>div]:bg-destructive' : '',
                    )}
                  />
                </div>
              )
            })
          )}
        </CardContent>
      </Card>
    </div>
  )
}
