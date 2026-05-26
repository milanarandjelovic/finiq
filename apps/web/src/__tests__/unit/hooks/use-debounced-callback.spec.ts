import { act, renderHook } from '@testing-library/react'
import { vi } from 'vitest'

import { useDebouncedCallback } from '@/hooks/use-debounced-callback'

describe('useDebouncedCallback', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should call the callback after the delay', () => {
    const fn = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(fn, 300))

    act(() => {
      result.current('arg1')
    })

    expect(fn).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('arg1')
  })

  it('should debounce multiple rapid calls', () => {
    const fn = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(fn, 300))

    act(() => {
      result.current('a')
      result.current('b')
      result.current('c')
    })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should use the latest arguments', () => {
    const fn = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(fn, 300))

    act(() => {
      result.current('first')
      result.current('second')
      result.current('third')
    })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(fn).toHaveBeenCalledWith('third')
  })

  it('should not call the callback before the delay', () => {
    const fn = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(fn, 300))

    act(() => {
      result.current()
    })

    expect(fn).not.toHaveBeenCalled()
  })

  it('should handle a delay of 0', () => {
    const fn = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(fn, 0))

    act(() => {
      result.current()
    })

    expect(fn).not.toHaveBeenCalled()

    act(() => {
      vi.runAllTimers()
    })

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should clean up timer on unmount', () => {
    const fn = vi.fn()
    const { result, unmount } = renderHook(() => useDebouncedCallback(fn, 300))

    act(() => {
      result.current()
    })

    unmount()

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(fn).not.toHaveBeenCalled()
  })
})
