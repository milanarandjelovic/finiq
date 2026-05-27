import { renderHook } from '@testing-library/react'
import { vi } from 'vitest'

import { useCallbackRef } from '@/hooks/use-callback-ref'

describe('useCallbackRef', () => {
  it('should call the initial callback', () => {
    const fn = vi.fn()
    const { result } = renderHook(() => useCallbackRef(fn))
    result.current('arg1', 'arg2')

    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('arg1', 'arg2')
  })

  it('should call the updated callback after re-render', () => {
    const fn1 = vi.fn()
    const fn2 = vi.fn()
    const { result, rerender } = renderHook(({ cb }) => useCallbackRef(cb), {
      initialProps: { cb: fn1 },
    })
    result.current()

    expect(fn1).toHaveBeenCalledTimes(1)

    rerender({ cb: fn2 })
    result.current()

    expect(fn2).toHaveBeenCalledTimes(1)
    expect(fn1).toHaveBeenCalledTimes(1)
  })

  it('should maintain a stable reference across renders', () => {
    const fn = vi.fn()
    const { result, rerender } = renderHook(({ cb }) => useCallbackRef(cb), {
      initialProps: { cb: fn },
    })

    const firstRef = result.current
    rerender({ cb: vi.fn() })
    const secondRef = result.current

    expect(firstRef).toBe(secondRef)
  })

  it('should handle undefined callback', () => {
    const { result } = renderHook(() => useCallbackRef(undefined))

    expect(() => result.current()).not.toThrow()
    expect(result.current()).toBeUndefined()
  })
})
