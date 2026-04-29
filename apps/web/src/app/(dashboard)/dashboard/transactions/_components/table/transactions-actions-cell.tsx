import { MoreHorizontal } from 'lucide-react'

import { Button } from '@finiq/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@finiq/ui/components/dropdown-menu'
import { TransactionRow } from '@/app/(dashboard)/dashboard/transactions/_components/table/transactions-table-columns'

export function TransactionActionsCell({ row }: { row: TransactionRow }) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="text-destructive cursor-pointer"
          onSelect={() => row.onDelete(row.id)}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
