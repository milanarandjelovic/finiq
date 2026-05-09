'use client'

import { useMemo } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs'
import { useTranslation } from 'react-i18next'

import { PAGINATION_PAGE_LIMIT, PAGINATION_PAGE_START } from '@finiq/shared'
import { Checkbox } from '@finiq/ui/components/checkbox'
import {
  getCategoryControllerFindAllQueryKey,
  useCategoryControllerFindAll,
} from '@/api/__generated__/categories/categories'
import type {
  Category,
  CategoryControllerFindAll200,
} from '@/api/__generated__/models'
import { CategoryActionsCell } from '@/app/(dashboard)/dashboard/categories/_components/table/categories-actions-cell'
import { CategoriesTableToolbarActions } from '@/app/(dashboard)/dashboard/categories/_components/table/categories-table-toolbar-actions'
import { DataTable } from '@/components/shared/data-table/data-table'
import { DataTableSkeleton } from '@/components/shared/data-table/data-table-skeleton'
import { DataTableToolbar } from '@/components/shared/data-table/data-table-toolbar'
import { useDataTable } from '@/hooks/use-data-table'
import { type DataTableFilterField } from '@/types/data-table'

interface CategoriesTableProps {
  isGoal: number
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
}

export function CategoriesTable({
  isGoal,
  onEdit,
  onDelete,
}: CategoriesTableProps) {
  const { t } = useTranslation()
  const [page] = useQueryState(
    'page',
    parseAsInteger.withDefault(PAGINATION_PAGE_START),
  )
  const [perPage] = useQueryState(
    'perPage',
    parseAsInteger.withDefault(PAGINATION_PAGE_LIMIT),
  )
  const [name] = useQueryState('name', parseAsString.withDefault(''))

  const { data: result, isLoading } = useCategoryControllerFindAll(
    {
      isGoal,
      name: name || undefined,
      currentPage: page,
      perPage,
    },
    {
      query: {
        queryKey: getCategoryControllerFindAllQueryKey({
          isGoal,
          name: name || undefined,
          currentPage: page,
          perPage,
        }),
        placeholderData: (prev) => prev,
      },
    },
  )

  const categoriesData = (
    result?.data as CategoryControllerFindAll200 | undefined
  )?.data?.categories
  const pageCount = categoriesData?.meta?.pagination?.lastPage ?? -1

  const data: Category[] = useMemo(
    () => categoriesData?.data ?? [],
    [categoriesData],
  )

  const filterFields: DataTableFilterField<Category>[] = useMemo(
    () => [
      {
        id: 'name' as keyof Category,
        label: t('general.name'),
        placeholder: t('table.filterByName'),
      },
    ],
    [t],
  )

  const columns: ColumnDef<Category>[] = useMemo(
    () => [
      {
        id: 'select',
        enableSorting: false,
        enableHiding: false,
        size: 20,
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label={t('table.selectAll')}
            className="translate-y-0.5"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label={t('table.selectRow')}
            className="translate-y-0.5"
          />
        ),
      },
      {
        accessorKey: 'name',
        header: t('general.name'),
        cell: ({ row }) => {
          const category = row.original
          return (
            <div className="flex items-center gap-3">
              <div
                className="flex size-9 shrink-0 items-center justify-center rounded-full text-base"
                style={{
                  backgroundColor: `${category.color}25`,
                  border: `1.5px solid ${category.color}40`,
                }}
              >
                {category.emoji}
              </div>
              <span className="font-medium">{category.name}</span>
            </div>
          )
        },
      },
      {
        id: 'color',
        header: t('categories.color'),
        size: 80,
        cell: ({ row }) => (
          <div
            className="size-4 rounded-full"
            style={{ backgroundColor: row.original.color }}
          />
        ),
      },
      {
        id: 'actions',
        header: '',
        size: 40,
        enableHiding: false,
        cell: ({ row }) => (
          <CategoryActionsCell
            category={row.original}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ),
      },
    ],
    [onEdit, onDelete, t],
  )

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    filterFields,
  })

  const toolbar = (
    <DataTableToolbar table={table} filterFields={filterFields}>
      <CategoriesTableToolbarActions table={table} />
    </DataTableToolbar>
  )

  if (isLoading) {
    return (
      <div className="w-full space-y-2.5">
        {toolbar}
        <DataTableSkeleton
          columnCount={4}
          rowCount={5}
          cellWidths={['20px', 'auto', '80px', '40px']}
          withPagination
          shrinkZero
        />
      </div>
    )
  }

  return <DataTable table={table}>{toolbar}</DataTable>
}
