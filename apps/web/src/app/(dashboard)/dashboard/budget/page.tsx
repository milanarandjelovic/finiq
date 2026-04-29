'use client'

import Link from 'next/link'
import { useQueryClient } from '@tanstack/react-query'
import { CopyIcon, TagIcon } from 'lucide-react'
import { toast } from 'sonner'

import { useMonthNavigation } from '@finiq/hooks'
import { Button } from '@finiq/ui/components/button'
import { Card, CardContent } from '@finiq/ui/components/card'
import { MonthPicker } from '@finiq/ui/components/month-picker'
import {
  getBudgetControllerFindAllQueryKey,
  useBudgetControllerCopyFromPreviousMonth,
  useBudgetControllerUpsert,
} from '@/api/__generated__/budgets/budgets'
import {
  getDashboardControllerGetDashboardQueryKey,
  useDashboardControllerGetDashboard,
} from '@/api/__generated__/dashboard/dashboard'
import type { DashboardControllerGetDashboard200 } from '@/api/__generated__/models'
import { BudgetTable } from '@/app/(dashboard)/dashboard/budget/_components/table/budget-table'
import { useCurrencyFormatter } from '@/hooks/use-currency-formatter'
import { routes } from '@/lib/routes'

interface CategoryBreakdownItem {
  categoryId: string
  name: string
  emoji: string
  color: string
  budgeted: number
  spent: number
  available: number
}

export default function BudgetPage() {
  const { year, month, date, setDate } = useMonthNavigation()
  const formatCurrency = useCurrencyFormatter()
  const qc = useQueryClient()

  const { data: dashboardResult } = useDashboardControllerGetDashboard(
    { year, month },
    {
      query: {
        queryKey: getDashboardControllerGetDashboardQueryKey({ year, month }),
      },
    },
  )
  const dashboard = (
    dashboardResult?.data as DashboardControllerGetDashboard200 | undefined
  )?.data?.dashboard

  const { mutate: upsertBudget } = useBudgetControllerUpsert({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({
          queryKey: getBudgetControllerFindAllQueryKey({ year, month }),
        })
        qc.invalidateQueries({
          queryKey: getDashboardControllerGetDashboardQueryKey({ year, month }),
        })
      },
      onError: () => toast.error('Failed to save budget'),
    },
  })

  const { mutate: copyBudget, isPending: isCopying } =
    useBudgetControllerCopyFromPreviousMonth({
      mutation: {
        onSuccess: () => {
          qc.invalidateQueries({
            queryKey: getBudgetControllerFindAllQueryKey({ year, month }),
          })
          toast.success('Budgets copied from previous month')
        },
        onError: () => toast.error('Failed to copy budgets'),
      },
    })

  const readyToAssign =
    (dashboard as { readyToAssign?: number } | undefined)?.readyToAssign ?? 0

  const breakdownMap = new Map(
    (dashboard?.categoryBreakdown ?? []).map((i: CategoryBreakdownItem) => [
      i.categoryId,
      i,
    ]),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <MonthPicker value={date} onChange={setDate} />

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyBudget({ data: { year, month } })}
            disabled={isCopying}
          >
            <CopyIcon className="size-3.5" />
            Copy previous month
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={routes.categories}>
              <TagIcon className="size-3.5" />
              Manage categories
            </Link>
          </Button>
        </div>
      </div>

      <Card className="py-3">
        <CardContent className="flex items-center justify-between px-6">
          <span className="text-muted-foreground text-sm font-medium">
            Ready to Assign
          </span>
          <span
            className={`text-2xl font-bold tabular-nums ${readyToAssign >= 0 ? 'text-green-500' : 'text-destructive'}`}
          >
            {formatCurrency(readyToAssign)}
          </span>
        </CardContent>
      </Card>

      <BudgetTable
        year={year}
        month={month}
        breakdownMap={breakdownMap}
        onUpsert={(categoryId, amount) =>
          upsertBudget({ data: { categoryId, amount, year, month } })
        }
      />
    </div>
  )
}
