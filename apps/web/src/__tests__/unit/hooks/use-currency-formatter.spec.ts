import { renderHook } from '@testing-library/react'
import { vi } from 'vitest'

import { useSettingControllerFindAll } from '@/api/__generated__/settings/settings'
import { useCurrencyFormatter } from '@/hooks/use-currency-formatter'

const mockUnwrap = vi.fn()

vi.mock('@/api/__generated__/settings/settings', () => ({
  useSettingControllerFindAll: vi.fn(),
}))

vi.mock('@/lib/api-response', () => ({
  unwrapApiResponse: (...args: any[]) => mockUnwrap(...args),
}))

describe('useCurrencyFormatter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return a function', () => {
    vi.mocked(useSettingControllerFindAll).mockReturnValue({
      data: undefined,
    } as any)
    mockUnwrap.mockReturnValue(undefined)
    const { result } = renderHook(() => useCurrencyFormatter())

    expect(typeof result.current).toBe('function')
  })

  it('should format amount with USD by default', () => {
    vi.mocked(useSettingControllerFindAll).mockReturnValue({
      data: undefined,
    } as any)
    mockUnwrap.mockReturnValue(undefined)
    const { result } = renderHook(() => useCurrencyFormatter())

    expect(result.current(42.5)).toBe('$42.50')
  })

  it('should format amount with the configured currency', () => {
    vi.mocked(useSettingControllerFindAll).mockReturnValue({
      data: {
        data: { data: { settings: { currency: 'EUR' } } },
      },
    } as any)
    mockUnwrap.mockReturnValue({
      data: { settings: { currency: 'EUR' } },
    })
    const { result } = renderHook(() => useCurrencyFormatter())

    expect(result.current(42.5)).toBe('€42.50')
  })
})
