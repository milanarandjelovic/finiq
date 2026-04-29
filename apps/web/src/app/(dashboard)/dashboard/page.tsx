'use client'

import { useMonthNavigation } from '@finiq/hooks'
import { calculateProgress, isOverBudget } from '@finiq/shared'
import { Badge } from '@finiq/ui/components/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@finiq/ui/components/card'
import { MonthPicker } from '@finiq/ui/components/month-picker'
import { Progress } from '@finiq/ui/components/progress'
import { Skeleton } from '@finiq/ui/components/skeleton'
import { cn } from '@finiq/ui/lib/utils'
import { useDashboardControllerGetDashboard } from '@/api/__generated__/dashboard/dashboard'
import type { DashboardControllerGetDashboard200 } from '@/api/__generated__/models'
import { SummaryCard } from '@/app/(dashboard)/dashboard/transactions/_components/summary-card'
import { useCurrencyFormatter } from '@/hooks/use-currency-formatter'

interface CategoryBreakdownItem {
  categoryId: string
  name: string
  emoji: string
  color: string
  budgeted: number
  spent: number
  available: number
}

interface DashboardData {
  totalIncome: number
  totalExpenses: number
  balance: number
  readyToAssign: number
  categoryBreakdown: CategoryBreakdownItem[]
}

export default function DashboardPage() {
  const formatCurrency = useCurrencyFormatter()
  const { year, month, date, setDate } = useMonthNavigation()

  const { data: dashboardResult, isLoading } =
    useDashboardControllerGetDashboard(
      { year, month },
      { query: { queryKey: ['dashboard', year, month] } },
    )

  const data = (
    dashboardResult?.data as DashboardControllerGetDashboard200 | undefined
  )?.data?.dashboard as DashboardData | undefined

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Overview</h1>
          <p className="text-muted-foreground text-sm">
            Your financial summary for this month.
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
              label="Income"
              value={data?.totalIncome ?? 0}
              variant="income"
              formatCurrency={formatCurrency}
            />

            <SummaryCard
              label="Expenses"
              value={data?.totalExpenses ?? 0}
              variant="expense"
              formatCurrency={formatCurrency}
            />

            <SummaryCard
              label="Balance"
              value={data?.balance ?? 0}
              variant="balance"
              formatCurrency={formatCurrency}
            />

            <SummaryCard
              label="Ready to assign"
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
            Category breakdown
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
              No categories yet.
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
                          Over
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
