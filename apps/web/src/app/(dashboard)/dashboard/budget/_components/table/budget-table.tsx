'use client'

import { useMemo } from 'react'
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs'
import { useTranslation } from 'react-i18next'

import {
  isOverBudget,
  PAGINATION_PAGE_LIMIT,
  PAGINATION_PAGE_START,
} from '@finiq/shared'
import {
  getBudgetControllerFindAllQueryKey,
  useBudgetControllerFindAll,
} from '@/api/__generated__/budgets/budgets'
import type {
  Budget,
  BudgetControllerFindAll200,
} from '@/api/__generated__/models'
import {
  useGetColumns,
  type BudgetRow,
} from '@/app/(dashboard)/dashboard/budget/_components/table/budget-table-columns'
import { BudgetTableToolbarActions } from '@/app/(dashboard)/dashboard/budget/_components/table/budget-table-toolbar-actions'
import { DataTable } from '@/components/shared/data-table/data-table'
import { DataTableSkeleton } from '@/components/shared/data-table/data-table-skeleton'
import { DataTableToolbar } from '@/components/shared/data-table/data-table-toolbar'
import { QueryError } from '@/components/shared/query-error'
import { useCurrencyFormatter } from '@/hooks/use-currency-formatter'
import { useDataTable } from '@/hooks/use-data-table'
import { unwrapApiResponse } from '@/lib/api-response'
import { type DataTableFilterField } from '@/types/data-table'

interface CategoryBreakdownItem {
  categoryId: string
  spent: number
  available: number
}

interface BudgetTableProps {
  year: number
  month: number
  breakdownMap: Map<string, CategoryBreakdownItem>
  onUpsert: (categoryId: string, amount: number) => void
}

export function BudgetTable({
  year,
  month,
  breakdownMap,
  onUpsert,
}: BudgetTableProps) {
  const { t } = useTranslation()
  const formatCurrency = useCurrencyFormatter()
  const columns = useGetColumns(formatCurrency)

  const filterFields: DataTableFilterField<BudgetRow>[] = useMemo(
    () => [
      {
        id: 'categoryName',
        label: t('transactions.category'),
        placeholder: t('table.filterByName'),
      },
    ],
    [t],
  )

  const [page] = useQueryState(
    'page',
    parseAsInteger.withDefault(PAGINATION_PAGE_START),
  )
  const [perPage] = useQueryState(
    'perPage',
    parseAsInteger.withDefault(PAGINATION_PAGE_LIMIT),
  )
  const [categoryName] = useQueryState(
    'categoryName',
    parseAsString.withDefault(''),
  )

  const {
    data: budgetsResult,
    isLoading,
    isError,
    refetch,
  } = useBudgetControllerFindAll(
    {
      year,
      month,
      currentPage: page,
      perPage,
      categoryName: categoryName || undefined,
    },
    {
      query: {
        queryKey: getBudgetControllerFindAllQueryKey({
          year,
          month,
          currentPage: page,
          perPage,
          categoryName,
        }),
        placeholderData: (prev) => prev,
      },
    },
  )

  const budgetsData = unwrapApiResponse<BudgetControllerFindAll200>(
    budgetsResult?.data,
  )?.data?.budgets
  const pageCount = budgetsData?.meta?.pagination?.lastPage ?? -1

  const data: BudgetRow[] = useMemo(
    () =>
      (budgetsData?.data ?? []).map((b: Budget) => {
        const budgeted = Number(b.amount)
        const breakdown = breakdownMap.get(b.category.id)
        const spent = breakdown?.spent ?? 0
        const available = breakdown?.available ?? budgeted - spent
        const pct = budgeted > 0 ? Math.round((spent / budgeted) * 100) : null

        return {
          categoryId: b.category.id,
          categoryName: b.category.name,
          categoryEmoji: b.category.emoji,
          categoryColor: b.category.color,
          budgeted,
          spent,
          available,
          pct,
          isOver: isOverBudget(spent, budgeted),
          assignmentStatus: 'assigned' as const,
          onUpsert,
        }
      }),
    [budgetsData, breakdownMap, onUpsert],
  )

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    filterFields,
  })

  const toolbar = (
    <DataTableToolbar table={table} filterFields={filterFields}>
      <BudgetTableToolbarActions table={table} onUpsert={onUpsert} />
    </DataTableToolbar>
  )

  if (isError) {
    return <QueryError onRetry={refetch} />
  }

  if (isLoading) {
    return (
      <div className="w-full space-y-2.5">
        {toolbar}
        <DataTableSkeleton
          columnCount={7}
          rowCount={5}
          cellWidths={[
            '20px',
            '260px',
            '120px',
            '120px',
            '120px',
            '120px',
            '100px',
          ]}
          withPagination
          shrinkZero
        />
      </div>
    )
  }

  return <DataTable table={table}>{toolbar}</DataTable>
}
