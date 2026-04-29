import { TransitionStartFunction, useCallback, useMemo, useState } from 'react'
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  RowSelectionState,
  SortingState,
  TableOptions,
  TableState,
  Updater,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import {
  parseAsInteger,
  parseAsString,
  useQueryState,
  useQueryStates,
  type Parser,
  type UseQueryStateOptions,
} from 'nuqs'

import { PAGINATION_PAGE_LIMIT, PAGINATION_PAGE_START } from '@finiq/shared'
import { useDebouncedCallback } from '@/hooks/use-debounced-callback'
import { getSortingStateParser } from '@/lib/parser'
import { DataTableFilterField, ExtendedSortingState } from '@/types/data-table'

interface UseDataTableProps<TData>
  extends
    Omit<
      TableOptions<TData>,
      | 'state'
      | 'pageCount'
      | 'getCoreRowModel'
      | 'manualFiltering'
      | 'manualPagination'
      | 'manualSorting'
    >,
    Required<Pick<TableOptions<TData>, 'pageCount'>> {
  filterFields?: DataTableFilterField<TData>[]
  history?: 'push' | 'replace'
  scroll?: boolean
  shallow?: boolean
  throttleMs?: number
  debounceMs?: number
  startTransition?: TransitionStartFunction
  clearOnDefault?: boolean
  initialState?: Omit<Partial<TableState>, 'sorting'> & {
    sorting?: ExtendedSortingState<TData>
  }
}

export function useDataTable<TData>({
  pageCount = -1,
  filterFields = [],
  history = 'replace',
  scroll = false,
  shallow = true,
  throttleMs = 50,
  debounceMs = 300,
  clearOnDefault = false,
  startTransition,
  initialState,
  ...props
}: UseDataTableProps<TData>) {
  const queryStateOptions = useMemo<
    Omit<UseQueryStateOptions<string>, 'parse'>
  >(
    () => ({
      history,
      scroll,
      shallow,
      throttleMs,
      debounceMs,
      clearOnDefault,
      startTransition,
    }),
    [
      history,
      scroll,
      shallow,
      throttleMs,
      debounceMs,
      clearOnDefault,
      startTransition,
    ],
  )

  const [rowSelection, setRowSelection] = useState<RowSelectionState>(
    initialState?.rowSelection ?? {},
  )
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialState?.columnVisibility ?? {},
  )

  const [page, setPage] = useQueryState(
    'page',
    parseAsInteger
      .withOptions(queryStateOptions)
      .withDefault(PAGINATION_PAGE_START),
  )

  const [perPage, setPerPage] = useQueryState(
    'perPage',
    parseAsInteger
      .withOptions(queryStateOptions)
      .withDefault(initialState?.pagination?.pageSize ?? PAGINATION_PAGE_LIMIT),
  )

  const [sorting, setSorting] = useQueryState(
    'sort',
    getSortingStateParser<TData>()
      .withOptions(queryStateOptions)
      .withDefault(initialState?.sorting ?? []),
  )

  const filterParsers = useMemo(
    () =>
      filterFields.reduce<Record<string, Parser<string>>>((acc, field) => {
        acc[field.id] = parseAsString.withOptions(queryStateOptions)
        return acc
      }, {}),
    [filterFields, queryStateOptions],
  )

  const [filterValues, setFilterValues] = useQueryStates(filterParsers)
  const debouncedSetFilterValues = useDebouncedCallback(
    setFilterValues,
    debounceMs,
  )

  const pagination: PaginationState = {
    pageIndex: page - 1,
    pageSize: perPage,
  }

  function onPaginationChange(updaterOrValue: Updater<PaginationState>) {
    const newPagination =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(pagination)
        : updaterOrValue

    void setPage(newPagination.pageIndex + 1)
    void setPerPage(newPagination.pageSize)
  }

  function onSortingChange(updaterOrValue: Updater<SortingState>) {
    if (typeof updaterOrValue === 'function') {
      void setSorting(updaterOrValue(sorting) as ExtendedSortingState<TData>)
    }
  }

  const initialColumnFilters: ColumnFiltersState = useMemo(
    () =>
      Object.entries(filterValues).reduce<ColumnFiltersState>(
        (filters, [key, value]) => {
          if (value !== null) {
            filters.push({
              id: key,
              value: Array.isArray(value) ? value : [value],
            })
          }
          return filters
        },
        [],
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>(initialColumnFilters)

  const { searchableColumns, filterableColumns } = useMemo(
    () => ({
      searchableColumns: filterFields.filter((f) => !f.options),
      filterableColumns: filterFields.filter((f) => f.options),
    }),
    [filterFields],
  )

  const onColumnFiltersChange = useCallback(
    (updaterOrValue: Updater<ColumnFiltersState>) => {
      setColumnFilters((prev) => {
        const next =
          typeof updaterOrValue === 'function'
            ? updaterOrValue(prev)
            : updaterOrValue

        const filterUpdates = next.reduce<Record<string, string | null>>(
          (acc, filter) => {
            if (
              searchableColumns.find((col) => col.id === filter.id) ||
              filterableColumns.find((col) => col.id === filter.id)
            ) {
              acc[filter.id] = filter.value as string
            }
            return acc
          },
          {},
        )

        prev.forEach((prevFilter) => {
          if (!next.some((f) => f.id === prevFilter.id)) {
            filterUpdates[prevFilter.id] = null
          }
        })

        void setPage(1)
        debouncedSetFilterValues(filterUpdates)
        return next
      })
    },
    [debouncedSetFilterValues, filterableColumns, searchableColumns, setPage],
  )

  const table = useReactTable({
    ...props,
    initialState,
    pageCount,
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange,
    onSortingChange,
    onColumnFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  })

  return { table, page, perPage }
}
