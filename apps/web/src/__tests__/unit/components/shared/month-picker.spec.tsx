import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { MonthPicker } from '@/components/shared/month-picker'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}))

vi.mock('@finiq/ui/components/button', () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}))

vi.mock('@finiq/ui/components/popover', () => ({
  Popover: ({ children }: any) => <div>{children}</div>,
  PopoverContent: ({ children }: any) => <div>{children}</div>,
  PopoverTrigger: ({ children }: any) => <div>{children}</div>,
}))

vi.mock('@finiq/ui/components/select', () => ({
  Select: ({ children }: any) => <div>{children}</div>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children, value }: any) => (
    <div data-value={value}>{children}</div>
  ),
  SelectTrigger: ({ children }: any) => <div>{children}</div>,
  SelectValue: () => <span />,
}))

vi.mock('lucide-react', () => ({
  CalendarIcon: () => <span>CalendarIcon</span>,
}))

describe('MonthPicker', () => {
  const baseDate = new Date(2026, 4, 1)

  it('should render the selected month and year in the trigger button', () => {
    render(<MonthPicker value={baseDate} onChange={vi.fn()} />)

    expect(screen.getByText('May 2026')).toBeInTheDocument()
  })

  it('should render a calendar icon', () => {
    render(<MonthPicker value={baseDate} onChange={vi.fn()} />)

    expect(screen.getByText('CalendarIcon')).toBeInTheDocument()
  })
})
