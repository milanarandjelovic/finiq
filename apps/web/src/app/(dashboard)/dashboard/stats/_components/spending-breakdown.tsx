'use client'

import { useTranslation } from 'react-i18next'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@finiq/ui/components/card'
import { Skeleton } from '@finiq/ui/components/skeleton'
import type { SpendingByCategoryItemDto } from '@/api/__generated__/models'

interface SpendingBreakdownProps {
  data: SpendingByCategoryItemDto[] | undefined
  isLoading: boolean
}

export function SpendingBreakdown({ data, isLoading }: SpendingBreakdownProps) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('statistics.breakdown')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))
          : (data ?? []).map((item) => (
              <div key={item.categoryId} className="flex items-center gap-3">
                <div
                  className="size-3 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="flex-1 text-sm">
                  {item.emoji} {item.name}
                </span>
                <span className="text-sm font-medium">
                  ${Number(item.amount).toFixed(2)}
                </span>
                <span className="text-muted-foreground w-10 text-right text-xs">
                  {item.percentage.toFixed(0)}%
                </span>
              </div>
            ))}
      </CardContent>
    </Card>
  )
}
