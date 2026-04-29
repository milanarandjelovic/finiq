'use client'

import { useEffect, useMemo, useState } from 'react'
import { type Column, type Table } from '@tanstack/react-table'
import { X } from 'lucide-react'

import { Button } from '@finiq/ui/components/button'
import { Input } from '@finiq/ui/components/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@finiq/ui/components/select'
import { cn } from '@finiq/ui/lib/utils'
import { useDebouncedCallback } from '@/hooks/use-debounced-callback'
import { type DataTableFilterField } from '@/types/data-table'

function ToolbarSearchInput<TData>({
  column,
  placeholder,
}: {
  column: Column<TData, unknown> | undefined
  placeholder: string
}) {
  const filterValue = (column?.getFilterValue() as string) ?? ''
  const [value, setValue] = useState(filterValue)

  const debouncedSetFilter = useDebouncedCallback(
    (val: string) => column?.setFilterValue(val || undefined),
    300,
  )

  useEffect(() => {
    if (!filterValue) setValue('')
  }, [filterValue])

  return (
    <Input
      placeholder={placeholder}
      value={value}
      onChange={(e) => {
        setValue(e.target.value)
        debouncedSetFilter(e.target.value)
      }}
      className="h-8 w-40 lg:w-64"
    />
  )
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  filterFields?: DataTableFilterField<TData>[]
  className?: string
  children?: React.ReactNode
}

export function DataTableToolbar<TData>({
  table,
  filterFields = [],
  className,
  children,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const { searchableColumns, filterableColumns } = useMemo(
    () => ({
      searchableColumns: filterFields.filter((f) => !f.options),
      filterableColumns: filterFields.filter((f) => f.options),
    }),
    [filterFields],
  )

  return (
    <div
      className={cn(
        'flex w-full items-center justify-between gap-2 overflow-auto',
        className,
      )}
    >
      <div className="flex flex-1 items-center gap-2">
        {searchableColumns.map((field) => (
          <ToolbarSearchInput
            key={String(field.id)}
            column={table.getColumn(String(field.id))}
            placeholder={field.placeholder ?? `Filter by ${field.label}…`}
          />
        ))}

        {filterableColumns.map(
          (field) =>
            table.getColumn(String(field.id)) && (
              <Select
                key={String(field.id)}
                value={
                  (table
                    .getColumn(String(field.id))
                    ?.getFilterValue() as string) ?? 'all'
                }
                onValueChange={(value) =>
                  table
                    .getColumn(String(field.id))
                    ?.setFilterValue(value === 'all' ? undefined : value)
                }
              >
                <SelectTrigger className="h-8 w-36">
                  <SelectValue placeholder={field.label} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{field.label}: All</SelectItem>
                  {field.options?.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ),
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={() => table.resetColumnFilters()}
          >
            Reset
            <X className="ml-1 size-4" />
          </Button>
        )}
      </div>

      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  )
}
