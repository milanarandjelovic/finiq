'use client'

import { HTMLAttributes } from 'react'
import { flexRender, type Table as TanstackTable } from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@finiq/ui/components/table'
import { cn } from '@finiq/ui/lib/utils'
import { DataTablePagination } from '@/components/shared/data-table/data-table-pagination'

interface DataTableProps<TData> extends HTMLAttributes<HTMLDivElement> {
  table: TanstackTable<TData>
  withPagination?: boolean
}

export function DataTable<TData>({
  table,
  children,
  className,
  withPagination = true,
  ...props
}: DataTableProps<TData>) {
  return (
    <div className={cn('w-full space-y-2.5', className)} {...props}>
      {children}

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{ width: `${header.getSize()}px` }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-12 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {withPagination && <DataTablePagination table={table} />}
    </div>
  )
}
