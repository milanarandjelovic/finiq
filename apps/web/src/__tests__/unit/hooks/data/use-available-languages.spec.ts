import { createElement } from 'react'
import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { vi } from 'vitest'

import { useAvailableLanguages } from '@/hooks/data/use-available-languages'

const mockFetch = vi.fn()
globalThis.fetch = mockFetch

vi.mock('@/util/env', () => ({
  Env: { i18nUrl: 'https://i18n.finiq.test' },
}))

function createWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  const Wrapper = ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: qc }, children)
  Wrapper.displayName = 'TestWrapper'
  return Wrapper
}

describe('useAvailableLanguages', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call fetch with the correct URL', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(['en', 'sr']),
    })
    const { result } = renderHook(() => useAvailableLanguages(), {
      wrapper: createWrapper(),
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockFetch).toHaveBeenCalledWith('https://i18n.finiq.test/locales')
  })

  it('should return an array of strings on success', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(['en', 'sr']),
    })
    const { result } = renderHook(() => useAvailableLanguages(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.data).toEqual(['en', 'sr'])
    })
  })

  it('should throw on non-ok response', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
    })
    const { result } = renderHook(() => useAvailableLanguages(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
      expect(result.current.error).toBeDefined()
    })
  })
})
