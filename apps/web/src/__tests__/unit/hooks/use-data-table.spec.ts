import { act, renderHook } from '@testing-library/react'
import { vi } from 'vitest'

import { useDataTable } from '@/hooks/use-data-table'

const mockSetPage = vi.hoisted(() => vi.fn())
const mockSetPerPage = vi.hoisted(() => vi.fn())
const mockSetSorting = vi.hoisted(() => vi.fn())
const mockSetFilterValues = vi.hoisted(() => vi.fn())
const mockUseQueryStates = vi.hoisted(() => vi.fn())

vi.mock('nuqs', () => ({
  parseAsInteger: {
    withOptions: () => ({
      withDefault: (defaultVal: number) => defaultVal,
    }),
  },
  parseAsString: {
    withOptions: () => 'string-parser',
  },
  useQueryState: (_key: string, defaultVal: any) => {
    if (_key === 'page') {
      return [defaultVal, mockSetPage]
    }

    if (_key === 'perPage') {
      return [defaultVal, mockSetPerPage]
    }

    if (_key === 'sort') {
      return [defaultVal, mockSetSorting]
    }

    return [defaultVal, vi.fn()]
  },
  useQueryStates: mockUseQueryStates,
}))

vi.mock('@/hooks/use-debounced-callback', () => ({
  useDebouncedCallback: (fn: any) => fn,
}))

vi.mock('@/lib/parser', () => ({
  getSortingStateParser: () => ({
    withOptions: () => ({
      withDefault: (val: any) => val ?? [],
    }),
  }),
}))

describe('useDataTable', () => {
  const defaultProps = {
    columns: [],
    data: [],
    pageCount: 1,
    getCoreRowModel: () => ({}) as any,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseQueryStates.mockReturnValue([{}, mockSetFilterValues])
  })

  it('should return table, page, and perPage', () => {
    const { result } = renderHook(() => useDataTable(defaultProps as any))

    expect(result.current).toHaveProperty('table')
    expect(result.current).toHaveProperty('page')
    expect(result.current).toHaveProperty('perPage')
  })

  it('should return a table instance with core methods', () => {
    const { result } = renderHook(() => useDataTable(defaultProps as any))

    expect(typeof result.current.table.getHeaderGroups).toBe('function')
    expect(typeof result.current.table.getRowModel).toBe('function')
    expect(typeof result.current.table.getState).toBe('function')
  })

  it('should default page to 1', () => {
    const { result } = renderHook(() => useDataTable(defaultProps as any))

    expect(result.current.page).toBe(1)
  })

  it('should default perPage to 10', () => {
    const { result } = renderHook(() => useDataTable(defaultProps as any))

    expect(result.current.perPage).toBe(10)
  })

  it('should create pagination state from page/perPage', () => {
    const { result } = renderHook(() => useDataTable(defaultProps as any))
    const state = result.current.table.getState()

    expect(state.pagination.pageIndex).toBe(0)
    expect(state.pagination.pageSize).toBe(10)
  })

  it('should create empty sorting state by default', () => {
    const { result } = renderHook(() => useDataTable(defaultProps as any))

    expect(result.current.table.getState().sorting).toEqual([])
  })

  it('should create empty row selection by default', () => {
    const { result } = renderHook(() => useDataTable(defaultProps as any))

    expect(result.current.table.getState().rowSelection).toEqual({})
  })

  it('should create empty column visibility by default', () => {
    const { result } = renderHook(() => useDataTable(defaultProps as any))

    expect(result.current.table.getState().columnVisibility).toEqual({})
  })

  it('should call setPage and setPerPage when pagination changes', () => {
    const { result } = renderHook(() => useDataTable(defaultProps as any))
    act(() => {
      result.current.table.setPagination({ pageIndex: 2, pageSize: 20 })
    })

    expect(mockSetPage).toHaveBeenCalledWith(3)
    expect(mockSetPerPage).toHaveBeenCalledWith(20)
  })

  it('should call setSorting when sorting changes with a function updater', () => {
    const { result } = renderHook(() => useDataTable(defaultProps as any))
    act(() => {
      result.current.table.setSorting((prev: any) => [
        ...prev,
        { id: 'name', desc: true },
      ])
    })

    expect(mockSetSorting).toHaveBeenCalled()
  })

  it('should build filterParsers for each filterField', () => {
    const { result } = renderHook(() =>
      useDataTable({
        ...defaultProps,
        filterFields: [{ id: 'name' }],
      } as any),
    )

    expect(result.current.table).toBeDefined()
  })

  it('should compute initialColumnFilters from non-null filterValues', () => {
    mockUseQueryStates.mockReturnValueOnce([{ name: 'test' }, vi.fn()])
    const { result } = renderHook(() =>
      useDataTable({
        ...defaultProps,
        filterFields: [{ id: 'name' }],
      } as any),
    )

    expect(result.current.table.getState().columnFilters).toEqual([
      { id: 'name', value: ['test'] },
    ])
  })

  it('should update filters and call setFilterValues when column filters change', () => {
    const { result } = renderHook(() =>
      useDataTable({
        ...defaultProps,
        filterFields: [{ id: 'name' }],
      } as any),
    )
    act(() => {
      result.current.table.setColumnFilters([{ id: 'name', value: 'test' }])
    })

    expect(mockSetFilterValues).toHaveBeenCalledWith({ name: 'test' })
    expect(mockSetPage).toHaveBeenCalledWith(1)
  })

  it('should set removed filter values to null when filters are cleared', () => {
    const { result } = renderHook(() =>
      useDataTable({
        ...defaultProps,
        filterFields: [{ id: 'name' }],
      } as any),
    )
    act(() => {
      result.current.table.setColumnFilters([{ id: 'name', value: 'test' }])
    })
    act(() => {
      result.current.table.setColumnFilters([])
    })

    expect(mockSetFilterValues).toHaveBeenLastCalledWith({ name: null })
  })
})
