import { useState } from 'react'

export function useMonthNavigation() {
  const now = new Date()
  const [date, setDate] = useState(
    () => new Date(now.getFullYear(), now.getMonth(), 1),
  )

  const year = date.getFullYear()
  const month = date.getMonth() + 1

  const prevMonth = () =>
    setDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))

  const nextMonth = () =>
    setDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))

  return {
    year,
    month,
    date,
    setDate,
    prevMonth,
    nextMonth,
  }
}
