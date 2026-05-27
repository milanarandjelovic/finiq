import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { DataTableToolbar } from '@/components/shared/data-table/data-table-toolbar'

vi.mock('react-i18next', async () => {
  const { createI18nMock } =
    await import('@/__tests__/unit/__mocks__/react-i18next')
  return createI18nMock({}, (key: string, opts?: any) => {
    if (key === 'table.filterBy') return `Filter by ${opts?.label ?? ''}`
    if (key === 'table.allOf') return `All ${opts?.label ?? ''}`
    return { 'general.reset': 'Reset' }[key] ?? key
  })
})

vi.mock(
  'lucide-react',
  async () => import('@/__tests__/unit/__mocks__/lucide-react'),
)

vi.mock(
  '@finiq/ui/components/button',
  async () => import('@/__tests__/unit/__mocks__/button'),
)

vi.mock('@finiq/ui/components/input', () => ({
  Input: ({ placeholder, value, onChange, className }: any) => (
    <input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={className}
    />
  ),
}))

vi.mock('@finiq/ui/components/select', () => ({
  Select: ({ children, value, onValueChange }: any) => (
    <select
      value={value}
      onChange={(e) => onValueChange?.(e.target.value)}
      data-testid="select"
    >
      {children}
    </select>
  ),
  SelectContent: ({ children }: any) => <>{children}</>,
  SelectItem: ({ children, value }: any) => (
    <option value={value}>{children}</option>
  ),
  SelectTrigger: ({ children }: any) => <>{children}</>,
  SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
}))

vi.mock('@/hooks/use-debounced-callback', () => ({
  useDebouncedCallback: (fn: any) => fn,
}))

function makeColumn(id: string, filterValue: string | undefined = undefined) {
  return {
    id,
    getFilterValue: vi.fn().mockReturnValue(filterValue),
    setFilterValue: vi.fn(),
  }
}

type TestRow = { name: string; status: string }

function makeTable(overrides: Partial<Record<string, any>> = {}) {
  const col1 = makeColumn('name')
  const col2 = makeColumn('status')

  return {
    getState: () => ({ columnFilters: [] }),
    getColumn: (id: string) =>
      id === 'name' ? col1 : id === 'status' ? col2 : undefined,
    resetColumnFilters: vi.fn(),
    _columns: { name: col1, status: col2 },
    ...overrides,
  } as any
}

describe('DataTableToolbar', () => {
  it('should render search input for searchable fields', () => {
    const table = makeTable()
    render(
      <DataTableToolbar<TestRow>
        table={table}
        filterFields={[{ id: 'name', label: 'Name' }]}
      />,
    )

    expect(screen.getByPlaceholderText(/Filter by Name/)).toBeInTheDocument()
  })

  it('should render select for filterable fields with options', () => {
    const table = makeTable()
    render(
      <DataTableToolbar<TestRow>
        table={table}
        filterFields={[
          {
            id: 'status',
            label: 'Status',
            options: [
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
            ],
          },
        ]}
      />,
    )

    expect(screen.getByTestId('select')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('Inactive')).toBeInTheDocument()
  })

  it('should not render reset button when no filters are active', () => {
    render(<DataTableToolbar table={makeTable()} />)

    expect(screen.queryByText('Reset')).not.toBeInTheDocument()
  })

  it('should render reset button when filters are active', () => {
    const table = makeTable({
      getState: () => ({ columnFilters: [{ id: 'name', value: 'foo' }] }),
    })

    render(<DataTableToolbar table={table} />)

    expect(screen.getByText('Reset')).toBeInTheDocument()
  })

  it('should call resetColumnFilters when reset is clicked', async () => {
    const table = makeTable({
      getState: () => ({ columnFilters: [{ id: 'name', value: 'foo' }] }),
    })

    render(<DataTableToolbar table={table} />)

    await userEvent.click(screen.getByText('Reset'))

    expect(table.resetColumnFilters).toHaveBeenCalledTimes(1)
  })

  it('should render children', () => {
    render(
      <DataTableToolbar table={makeTable()}>
        <button>Create</button>
      </DataTableToolbar>,
    )

    expect(screen.getByText('Create')).toBeInTheDocument()
  })

  it('should use custom placeholder when provided', () => {
    const table = makeTable()
    render(
      <DataTableToolbar<TestRow>
        table={table}
        filterFields={[
          { id: 'name', label: 'Name', placeholder: 'Search names...' },
        ]}
      />,
    )

    expect(screen.getByPlaceholderText('Search names...')).toBeInTheDocument()
  })

  it('should update search input value on change', async () => {
    const table = makeTable()
    render(
      <DataTableToolbar<TestRow>
        table={table}
        filterFields={[{ id: 'name', label: 'Name' }]}
      />,
    )

    const input = screen.getByPlaceholderText(/Filter by Name/)
    await userEvent.type(input, 'test')

    expect(input).toHaveValue('test')
  })
})
