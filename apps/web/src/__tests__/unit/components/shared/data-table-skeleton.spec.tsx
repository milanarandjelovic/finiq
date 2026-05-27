import { render, screen } from '@testing-library/react'

import { DataTableSkeleton } from '@/components/shared/data-table/data-table-skeleton'

vi.mock('@finiq/ui/components/skeleton', () => ({
  Skeleton: ({ className }: any) => (
    <div data-testid="skeleton" className={className} />
  ),
}))

vi.mock(
  '@finiq/ui/components/table',
  async () => import('@/__tests__/unit/__mocks__/table'),
)

describe('DataTableSkeleton', () => {
  it('should render header skeletons matching columnCount', () => {
    render(
      <DataTableSkeleton columnCount={3} rowCount={1} withPagination={false} />,
    )

    const skeletons = screen.getAllByTestId('skeleton')

    expect(skeletons).toHaveLength(6)
  })

  it('should render body skeletons matching rowCount', () => {
    render(
      <DataTableSkeleton columnCount={2} rowCount={4} withPagination={false} />,
    )

    const skeletons = screen.getAllByTestId('skeleton')

    expect(skeletons).toHaveLength(10)
  })

  it('should render pagination skeletons when withPagination is true', () => {
    const { container: withPagContainer } = render(
      <DataTableSkeleton columnCount={2} rowCount={2} withPagination={true} />,
    )
    const { container: withoutPagContainer } = render(
      <DataTableSkeleton columnCount={2} rowCount={2} withPagination={false} />,
    )

    const withPagCount = withPagContainer.querySelectorAll(
      '[data-testid="skeleton"]',
    ).length
    const withoutPagCount = withoutPagContainer.querySelectorAll(
      '[data-testid="skeleton"]',
    ).length

    expect(withPagCount).toBeGreaterThan(withoutPagCount)
  })

  it('should not render pagination when withPagination is false', () => {
    const { container } = render(
      <DataTableSkeleton columnCount={2} rowCount={2} withPagination={false} />,
    )

    expect(container.querySelector('.flex.w-full')).toBeNull()
  })

  it('should apply cell widths from cellWidths prop', () => {
    render(
      <DataTableSkeleton
        columnCount={2}
        rowCount={1}
        cellWidths={['100px', '200px']}
        withPagination={false}
      />,
    )

    const headers = screen.getAllByRole('columnheader')

    expect(headers[0]).toHaveStyle({ width: '100px' })
    expect(headers[1]).toHaveStyle({ width: '200px' })
  })

  it('should apply shrinkZero minWidth when shrinkZero is true', () => {
    render(
      <DataTableSkeleton
        columnCount={1}
        rowCount={1}
        cellWidths={['80px']}
        shrinkZero={true}
        withPagination={false}
      />,
    )

    const headers = screen.getAllByRole('columnheader')

    expect(headers[0]).toHaveStyle({ minWidth: '80px' })
  })

  it('should default to 10 rows and withPagination=true', () => {
    render(<DataTableSkeleton columnCount={1} />)

    const skeletons = screen.getAllByTestId('skeleton')

    expect(skeletons.length).toBeGreaterThan(11)
  })
})
