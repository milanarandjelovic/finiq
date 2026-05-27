import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { DataTablePagination } from '@/components/shared/data-table/data-table-pagination'

vi.mock('react-i18next', async () => {
  const { createI18nMock } =
    await import('@/__tests__/unit/__mocks__/react-i18next')
  return createI18nMock({
    'table.of': 'of',
    'table.rowsSelected': 'row(s) selected',
    'table.rowsPerPage': 'Rows per page',
    'table.page': 'Page',
    'table.goToFirstPage': 'Go to first page',
    'table.goToPreviousPage': 'Go to previous page',
    'table.goToNextPage': 'Go to next page',
    'table.goToLastPage': 'Go to last page',
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

vi.mock('@finiq/ui/components/select', () => ({
  Select: ({ children, value, onValueChange: _onValueChange }: any) => (
    <div data-value={value}>
      {typeof children === 'function' ? children() : children}
    </div>
  ),
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children, value }: any) => (
    <option value={value}>{children}</option>
  ),
  SelectTrigger: ({ children }: any) => <div>{children}</div>,
  SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
}))

function makeTable(overrides: Partial<Record<string, any>> = {}) {
  return {
    getFilteredSelectedRowModel: () => ({ rows: [] }),
    getFilteredRowModel: () => ({ rows: new Array(50) }),
    getState: () => ({ pagination: { pageSize: 10, pageIndex: 0 } }),
    getPageCount: () => 5,
    setPageSize: vi.fn(),
    setPageIndex: vi.fn(),
    previousPage: vi.fn(),
    nextPage: vi.fn(),
    getCanPreviousPage: () => false,
    getCanNextPage: () => true,
    ...overrides,
  } as any
}

describe('DataTablePagination', () => {
  it('should render rows selected and total count', () => {
    const table = makeTable({
      getFilteredSelectedRowModel: () => ({ rows: [1, 2] }),
      getFilteredRowModel: () => ({ rows: new Array(50) }),
    })

    render(<DataTablePagination table={table} />)

    const rowsText = screen.getByText(/row\(s\) selected/)

    expect(rowsText).toHaveTextContent('2')
    expect(rowsText).toHaveTextContent('50')
  })

  it('should render rows per page label', () => {
    render(<DataTablePagination table={makeTable()} />)

    expect(screen.getByText('Rows per page')).toBeInTheDocument()
  })

  it('should render page info with index and total pages', () => {
    render(<DataTablePagination table={makeTable()} />)

    const pageInfo = screen.getByText(/Page/)

    expect(pageInfo).toHaveTextContent('1')
    expect(pageInfo).toHaveTextContent('5')
  })

  it('should render page size options', () => {
    render(
      <DataTablePagination table={makeTable()} pageSizeOptions={[5, 10, 25]} />,
    )

    expect(screen.getAllByText('5').length).toBeGreaterThan(0)
    expect(screen.getAllByText('10').length).toBeGreaterThan(0)
    expect(screen.getAllByText('25').length).toBeGreaterThan(0)
  })

  it('should disable previous page buttons when on first page', () => {
    render(
      <DataTablePagination
        table={makeTable({ getCanPreviousPage: () => false })}
      />,
    )

    const prevBtn = screen.getByRole('button', { name: 'Go to previous page' })

    expect(prevBtn).toBeDisabled()
  })

  it('should disable next page buttons when on last page', () => {
    render(
      <DataTablePagination
        table={makeTable({ getCanNextPage: () => false })}
      />,
    )

    const nextBtn = screen.getByRole('button', { name: 'Go to next page' })

    expect(nextBtn).toBeDisabled()
  })

  it('should call nextPage when next button is clicked', async () => {
    const table = makeTable()
    render(<DataTablePagination table={table} />)

    await userEvent.click(
      screen.getByRole('button', { name: 'Go to next page' }),
    )

    expect(table.nextPage).toHaveBeenCalledTimes(1)
  })

  it('should call previousPage when previous button is clicked', async () => {
    const table = makeTable({ getCanPreviousPage: () => true })
    render(<DataTablePagination table={table} />)

    await userEvent.click(
      screen.getByRole('button', { name: 'Go to previous page' }),
    )

    expect(table.previousPage).toHaveBeenCalledTimes(1)
  })

  it('should call setPageIndex(0) when first page button is clicked', async () => {
    const table = makeTable({ getCanPreviousPage: () => true })
    render(<DataTablePagination table={table} />)

    await userEvent.click(
      screen.getByRole('button', { name: 'Go to first page' }),
    )

    expect(table.setPageIndex).toHaveBeenCalledWith(0)
  })

  it('should call setPageIndex(pageCount-1) when last page button is clicked', async () => {
    const table = makeTable()
    render(<DataTablePagination table={table} />)

    await userEvent.click(
      screen.getByRole('button', { name: 'Go to last page' }),
    )

    expect(table.setPageIndex).toHaveBeenCalledWith(4)
  })
})
