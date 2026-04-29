'use client'

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@finiq/ui/components/card'
import { Skeleton } from '@finiq/ui/components/skeleton'

export interface SpendingByCategoryItem {
  categoryId: string
  name: string
  emoji: string
  color: string
  amount: number
  percentage: number
}

interface SpendingPieChartProps {
  data: SpendingByCategoryItem[] | undefined
  isLoading: boolean
}

export function SpendingPieChart({ data, isLoading }: SpendingPieChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by category</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : (data?.length ?? 0) === 0 ? (
          <p className="text-muted-foreground py-8 text-center text-sm">
            No expense data.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data}
                dataKey="amount"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, payload }) =>
                  `${name} ${(payload?.percentage ?? 0).toFixed(0)}%`
                }
                labelLine={false}
              >
                {data?.map((entry) => (
                  <Cell key={entry.categoryId} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [
                  `$${Number(value).toFixed(2)}`,
                  'Amount',
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
