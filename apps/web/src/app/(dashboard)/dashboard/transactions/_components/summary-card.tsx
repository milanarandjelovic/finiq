import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@finiq/ui/components/card'
import { cn } from '@finiq/ui/lib/utils'

export function SummaryCard({
  label,
  value,
  variant,
  formatCurrency,
}: {
  label: string
  value: number
  variant: 'income' | 'expense' | 'balance' | 'assign'
  formatCurrency: (amount: number) => string
}) {
  const valueColorMap = {
    income: 'text-green-600 dark:text-green-400',
    expense: 'text-red-600 dark:text-red-400',
    balance: 'text-foreground',
    assign: 'text-blue-600 dark:text-blue-400',
  }

  const dotColorMap = {
    income: 'bg-green-500',
    expense: 'bg-red-500',
    balance: 'bg-foreground',
    assign: 'bg-blue-500',
  }

  return (
    <Card className="gap-3">
      <CardHeader className="pb-0">
        <CardTitle className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase">
          <span
            className={cn(
              'inline-block size-1.5 rounded-full',
              dotColorMap[variant],
            )}
          />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p
          className={cn(
            'text-xl font-semibold tabular-nums',
            valueColorMap[variant],
          )}
        >
          {formatCurrency(value)}
        </p>
      </CardContent>
    </Card>
  )
}
