import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { MonthPicker } from '@/components/shared/month-picker'

vi.mock(
  'react-i18next',
  async () => import('@/__tests__/unit/__mocks__/react-i18next'),
)

vi.mock(
  '@finiq/ui/components/button',
  async () => import('@/__tests__/unit/__mocks__/button'),
)

vi.mock('@finiq/ui/components/popover', () => ({
  Popover: ({ children, onOpenChange }: any) => (
    <div>
      <button data-testid="popover-open" onClick={() => onOpenChange?.(true)}>
        Open
      </button>
      {children}
    </div>
  ),
  PopoverContent: ({ children }: any) => <div>{children}</div>,
  PopoverTrigger: ({ children }: any) => <div>{children}</div>,
}))

vi.mock('@finiq/ui/components/select', () => ({
  Select: ({ children, value, onValueChange }: any) => (
    <select
      data-testid="year-select"
      value={value}
      onChange={(e) => onValueChange?.(e.target.value)}
    >
      {children}
    </select>
  ),
  SelectContent: ({ children }: any) => <>{children}</>,
  SelectItem: ({ children, value }: any) => (
    <option value={value}>{children}</option>
  ),
  SelectTrigger: () => null,
  SelectValue: () => null,
}))

vi.mock(
  'lucide-react',
  async () => import('@/__tests__/unit/__mocks__/lucide-react'),
)

describe('MonthPicker', () => {
  const now = new Date()
  const currentMonthDate = new Date(now.getFullYear(), now.getMonth(), 1)
  const pastDate = new Date(2020, 0, 1)

  it('should render the selected month and year in the trigger button', () => {
    render(<MonthPicker value={new Date(2026, 4, 1)} onChange={vi.fn()} />)

    expect(screen.getByText('May 2026')).toBeInTheDocument()
  })

  it('should render a calendar icon', () => {
    render(<MonthPicker value={currentMonthDate} onChange={vi.fn()} />)

    expect(screen.getByText('CalendarIcon')).toBeInTheDocument()
  })

  it('should call onChange when a month button is clicked', async () => {
    const onChange = vi.fn()
    render(<MonthPicker value={currentMonthDate} onChange={onChange} />)

    await userEvent.click(screen.getByText('Jan'))

    expect(onChange).toHaveBeenCalledWith(
      new Date(currentMonthDate.getFullYear(), 0, 1),
    )
  })

  it('should render the "current month" button when value is not the current month', () => {
    render(<MonthPicker value={pastDate} onChange={vi.fn()} />)

    expect(screen.getByText('monthPicker.currentMonth')).toBeInTheDocument()
  })

  it('should not render the "current month" button when value is the current month', () => {
    render(<MonthPicker value={currentMonthDate} onChange={vi.fn()} />)

    expect(
      screen.queryByText('monthPicker.currentMonth'),
    ).not.toBeInTheDocument()
  })

  it('should call onChange with the current month when "current month" is clicked', async () => {
    const onChange = vi.fn()
    render(<MonthPicker value={pastDate} onChange={onChange} />)

    await userEvent.click(screen.getByText('monthPicker.currentMonth'))

    expect(onChange).toHaveBeenCalledWith(
      new Date(now.getFullYear(), now.getMonth(), 1),
    )
  })

  it('should reset selectedYear to value year when popover is reopened', async () => {
    const onChange = vi.fn()

    render(<MonthPicker value={new Date(2024, 5, 1)} onChange={onChange} />)

    await userEvent.selectOptions(screen.getByTestId('year-select'), '2025')
    await userEvent.click(screen.getByTestId('popover-open'))
    await userEvent.click(screen.getByText('Jan'))

    expect(onChange).toHaveBeenCalledWith(new Date(2024, 0, 1))
  })
})
