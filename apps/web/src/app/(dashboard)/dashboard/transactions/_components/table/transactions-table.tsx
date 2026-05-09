'use client'

import { useMemo } from 'react'
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs'
import { useTranslation } from 'react-i18next'

import { PAGINATION_PAGE_LIMIT, PAGINATION_PAGE_START } from '@finiq/shared'
import type { TransactionControllerFindAll200 } from '@/api/__generated__/models'
import type { TransactionControllerFindAllType } from '@/api/__generated__/models/transactionControllerFindAllType'
import {
  getTransactionControllerFindAllQueryKey,
  useTransactionControllerFindAll,
} from '@/api/__generated__/transactions/transactions'
import {
  useGetColumns,
  type TransactionRow,
} from '@/app/(dashboard)/dashboard/transactions/_components/table/transactions-table-columns'
import { TransactionsTableToolbarActions } from '@/app/(dashboard)/dashboard/transactions/_components/table/transactions-table-toolbar-actions'
import { DataTable } from '@/components/shared/data-table/data-table'
import { DataTableSkeleton } from '@/components/shared/data-table/data-table-skeleton'
import { DataTableToolbar } from '@/components/shared/data-table/data-table-toolbar'
import { useCurrencyFormatter } from '@/hooks/use-currency-formatter'
import { useDataTable } from '@/hooks/use-data-table'
import { type DataTableFilterField } from '@/types/data-table'

interface TransactionsTableProps {
  year: number
  month: number
  onDelete: (id: string) => void
}

export function TransactionsTable({
  year,
  month,
  onDelete,
}: TransactionsTableProps) {
  const { t } = useTranslation()
  const formatCurrency = useCurrencyFormatter()
  const columns = useGetColumns(formatCurrency)

  const filterFields: DataTableFilterField<TransactionRow>[] = useMemo(
    () => [
      {
        id: 'categoryName',
        label: t('transactions.category'),
        placeholder: t('table.searchByCategory'),
      },
      {
        id: 'type',
        label: t('transactions.type'),
        options: [
          { label: t('transactions.income'), value: 'income' },
          { label: t('transactions.expense'), value: 'expense' },
        ],
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
  const [type] = useQueryState('type', parseAsString.withDefault(''))
  const [categoryName] = useQueryState(
    'categoryName',
    parseAsString.withDefault(''),
  )

  const { data: result, isLoading } = useTransactionControllerFindAll(
    {
      year,
      month,
      currentPage: page,
      perPage,
      type: type ? (type as TransactionControllerFindAllType) : undefined,
      categoryName: categoryName || undefined,
    },
    {
      query: {
        queryKey: getTransactionControllerFindAllQueryKey({
          year,
          month,
          currentPage: page,
          perPage,
          type: type ? (type as TransactionControllerFindAllType) : undefined,
          categoryName: categoryName || undefined,
        }),
        placeholderData: (prev) => prev,
      },
    },
  )

  const transactionsData = (
    result?.data as TransactionControllerFindAll200 | undefined
  )?.data?.transactions
  const pageCount = transactionsData?.meta?.pagination?.lastPage ?? -1

  const data: TransactionRow[] = useMemo(
    () =>
      (transactionsData?.data ?? []).map((t) => ({
        id: t.id,
        type: t.type as 'income' | 'expense',
        amount: t.amount,
        date: String(t.date),
        note: t.note ?? null,
        category: t.category ?? null,
        categoryName: t.category?.name ?? '',
        onDelete,
      })),
    [transactionsData, onDelete],
  )

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    filterFields,
  })

  const toolbar = (
    <DataTableToolbar table={table} filterFields={filterFields}>
      <TransactionsTableToolbarActions table={table} />
    </DataTableToolbar>
  )

  if (isLoading) {
    return (
      <div className="w-full space-y-2.5">
        {toolbar}
        <DataTableSkeleton
          columnCount={8}
          rowCount={5}
          cellWidths={[
            '20px',
            '0px',
            '100px',
            '110px',
            '160px',
            '200px',
            '130px',
            '40px',
          ]}
          withPagination
          shrinkZero
        />
      </div>
    )
  }

  return <DataTable table={table}>{toolbar}</DataTable>
}
