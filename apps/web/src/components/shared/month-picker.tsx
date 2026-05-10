'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { enUS, srLatn } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@finiq/ui/components/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@finiq/ui/components/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@finiq/ui/components/select'

const localeMap = { en: enUS, sr: srLatn }

interface MonthPickerProps {
  value: Date
  onChange: (date: Date) => void
  fromYear?: number
  toYear?: number
}

export function MonthPicker({
  value,
  onChange,
  fromYear = 2020,
  toYear = new Date().getFullYear() + 1,
}: MonthPickerProps) {
  const { t, i18n } = useTranslation()
  const locale = localeMap[i18n.language as keyof typeof localeMap] ?? enUS
  const [open, setOpen] = useState(false)
  const [selectedYear, setSelectedYear] = useState(value.getFullYear())

  const now = new Date()
  const isCurrentMonth =
    value.getFullYear() === now.getFullYear() &&
    value.getMonth() === now.getMonth()

  const years = Array.from(
    { length: toYear - fromYear + 1 },
    (_, i) => fromYear + i,
  )

  const months = Array.from({ length: 12 }, (_, i) =>
    format(new Date(2000, i, 1), 'MMM', { locale }),
  )

  function selectMonth(monthIndex: number) {
    onChange(new Date(selectedYear, monthIndex, 1))
    setOpen(false)
  }

  function goToCurrentMonth() {
    setSelectedYear(now.getFullYear())
    onChange(new Date(now.getFullYear(), now.getMonth(), 1))
    setOpen(false)
  }

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        if (o) setSelectedYear(value.getFullYear())
        setOpen(o)
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-44 justify-start gap-2 font-normal"
        >
          <CalendarIcon className="text-muted-foreground size-4" />
          {format(value, 'MMMM yyyy', { locale })}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3" align="end">
        <Select
          value={String(selectedYear)}
          onValueChange={(v) => setSelectedYear(Number(v))}
        >
          <SelectTrigger className="mb-3 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="grid grid-cols-3 gap-1">
          {months.map((name, i) => {
            const isSelected =
              value.getFullYear() === selectedYear && value.getMonth() === i
            const isToday =
              now.getFullYear() === selectedYear && now.getMonth() === i
            return (
              <Button
                key={name}
                variant={isSelected ? 'default' : 'ghost'}
                size="sm"
                className={
                  isToday && !isSelected ? 'border-primary/40 border' : ''
                }
                onClick={() => selectMonth(i)}
              >
                {name}
              </Button>
            )
          })}
        </div>

        {!isCurrentMonth && (
          <div className="mt-2 border-t pt-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={goToCurrentMonth}
            >
              {t('monthPicker.currentMonth')}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
