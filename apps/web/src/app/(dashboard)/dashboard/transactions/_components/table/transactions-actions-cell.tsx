import { MoreHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@finiq/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@finiq/ui/components/dropdown-menu'
import { TransactionRow } from '@/app/(dashboard)/dashboard/transactions/_components/table/transactions-table-columns'

export function TransactionActionsCell({ row }: { row: TransactionRow }) {
  const { t } = useTranslation()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          data-testid="transaction-row-actions"
        >
          <span className="sr-only">{t('general.openMenu')}</span>
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="text-destructive cursor-pointer"
          onSelect={() => row.onDelete(row.id)}
          data-testid="transaction-delete-action"
        >
          {t('general.delete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
