import { Dimensions } from 'react-native'
import { Rect, Svg, Text as SvgText } from 'react-native-svg'

import { MONTH_NAMES } from '@finiq/shared'
import { View } from '@/components/ui/view'
import type { MonthlyTrendItem } from '@/types/statistics'

export function TrendBarChart({ data }: { data: MonthlyTrendItem[] }) {
  const chartWidth = Dimensions.get('window').width - 32
  const chartHeight = 180
  const maxValue = Math.max(...data.flatMap((d) => [d.income, d.expenses]), 1)
  const groupWidth = chartWidth / (data.length || 1)
  const barWidth = groupWidth * 0.3

  return (
    <Svg width={chartWidth} height={chartHeight + 24}>
      {data.map((item, i) => {
        const x = i * groupWidth + groupWidth * 0.1
        const incomeH = (item.income / maxValue) * chartHeight
        const expenseH = (item.expenses / maxValue) * chartHeight
        return (
          <View key={i}>
            <Rect
              x={x}
              y={chartHeight - incomeH}
              width={barWidth}
              height={incomeH}
              fill="#16a34a"
              rx={3}
            />
            <Rect
              x={x + barWidth + 2}
              y={chartHeight - expenseH}
              width={barWidth}
              height={expenseH}
              fill="#dc2626"
              rx={3}
            />
            <SvgText
              x={x + barWidth}
              y={chartHeight + 16}
              fontSize={10}
              fill="#71717a"
              textAnchor="middle"
            >
              {MONTH_NAMES[item.month - 1]?.slice(0, 3)}
            </SvgText>
          </View>
        )
      })}
    </Svg>
  )
}
