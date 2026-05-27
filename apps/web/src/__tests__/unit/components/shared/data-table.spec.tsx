import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { DataTable } from '@/components/shared/data-table/data-table'

vi.mock('react-i18next', async () => {
  const { createI18nMock } =
    await import('@/__tests__/unit/__mocks__/react-i18next')
  return createI18nMock({ 'table.noResults': 'No results.' })
})

vi.mock('@tanstack/react-table', () => ({
  flexRender: (component: any, context: any) =>
    typeof component === 'function' ? component(context) : component,
}))

vi.mock(
  '@finiq/ui/components/table',
  async () => import('@/__tests__/unit/__mocks__/table'),
)

vi.mock('@/components/shared/data-table/data-table-pagination', () => ({
  DataTablePagination: () => <div data-testid="pagination" />,
}))

function makeTable(rows: any[] = []) {
  return {
    getHeaderGroups: () => [
      {
        id: 'header-group-1',
        headers: [
          {
            id: 'col-1',
            colSpan: 1,
            isPlaceholder: false,
            getContext: () => ({}),
            getSize: () => 100,
            column: {
              columnDef: {
                header: () => 'Name',
              },
            },
          },
        ],
      },
    ],
    getRowModel: () => ({
      rows: rows.map((row, i) => ({
        id: `row-${i}`,
        getIsSelected: () => false,
        getVisibleCells: () => [
          {
            id: `cell-${i}`,
            getContext: () => ({}),
            column: {
              columnDef: {
                cell: () => row.name,
              },
            },
          },
        ],
      })),
    }),
    getAllColumns: () => [{ id: 'col-1' }],
  } as any
}

describe('DataTable', () => {
  it('should render column headers', () => {
    render(<DataTable table={makeTable()} />)

    expect(screen.getByText('Name')).toBeInTheDocument()
  })

  it('should render rows when data is present', () => {
    const table = makeTable([{ name: 'Alice' }, { name: 'Bob' }])
    render(<DataTable table={table} />)

    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })

  it('should render empty state when no rows', () => {
    render(<DataTable table={makeTable()} />)

    expect(screen.getByText('No results.')).toBeInTheDocument()
  })

  it('should render pagination by default', () => {
    render(<DataTable table={makeTable()} />)

    expect(screen.getByTestId('pagination')).toBeInTheDocument()
  })

  it('should not render pagination when withPagination is false', () => {
    render(<DataTable table={makeTable()} withPagination={false} />)

    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument()
  })

  it('should render children', () => {
    render(
      <DataTable table={makeTable()}>
        <div data-testid="toolbar">toolbar</div>
      </DataTable>,
    )

    expect(screen.getByTestId('toolbar')).toBeInTheDocument()
  })

  it('should render placeholder header as null', () => {
    const table = {
      ...makeTable(),
      getHeaderGroups: () => [
        {
          id: 'header-group-1',
          headers: [
            {
              id: 'placeholder-col',
              colSpan: 1,
              isPlaceholder: true,
              getContext: () => ({}),
              getSize: () => 50,
              column: { columnDef: { header: () => 'Hidden' } },
            },
          ],
        },
      ],
    } as any

    render(<DataTable table={table} />)

    expect(screen.queryByText('Hidden')).not.toBeInTheDocument()
  })

  it('should mark selected rows with data-state', () => {
    const table = {
      ...makeTable([{ name: 'Alice' }]),
      getRowModel: () => ({
        rows: [
          {
            id: 'row-0',
            getIsSelected: () => true,
            getVisibleCells: () => [
              {
                id: 'cell-0',
                getContext: () => ({}),
                column: { columnDef: { cell: () => 'Alice' } },
              },
            ],
          },
        ],
      }),
    } as any

    const { container } = render(<DataTable table={table} />)
    const selectedRow = container.querySelector('tr[data-state="selected"]')

    expect(selectedRow).toBeInTheDocument()
  })
})
