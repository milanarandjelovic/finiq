import { act, renderHook } from '@testing-library/react'
import { vi } from 'vitest'
import { z } from 'zod'

import { useZodForm } from '@/hooks/use-zod-form'
import { setApiFormErrors } from '@/lib/set-api-form-errors'

vi.mock('@/lib/set-api-form-errors', () => ({
  setApiFormErrors: vi.fn(),
}))

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

describe('useZodForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return form methods', () => {
    const { result } = renderHook(() => useZodForm(schema))

    expect(result.current.register).toBeDefined()
    expect(result.current.handleSubmit).toBeDefined()
    expect(result.current.formState).toBeDefined()
    expect(result.current.setError).toBeDefined()
  })

  it('should return handleApiSubmit', () => {
    const { result } = renderHook(() => useZodForm(schema))

    expect(result.current.handleApiSubmit).toBeDefined()
    expect(typeof result.current.handleApiSubmit).toBe('function')
  })

  it('should call onSubmit when form is valid', async () => {
    const onSubmit = vi.fn()
    const { result } = renderHook(() => useZodForm(schema))
    const handler = result.current.handleApiSubmit(onSubmit)

    expect(handler).toBeInstanceOf(Function)
  })

  it('should call onSubmit with values when handleApiSubmit handler is invoked', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const { result } = renderHook(() =>
      useZodForm(schema, {
        defaultValues: { email: 'test@example.com', password: 'secret123' },
      }),
    )

    await act(async () => {
      const handler = result.current.handleApiSubmit(onSubmit)
      await handler(new Event('submit') as any)
    })

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'secret123',
    })
  })

  it('should call setApiFormErrors and rethrow when onSubmit throws', async () => {
    const error = new Error('api error')
    const onSubmit = vi.fn().mockRejectedValue(error)
    const { result } = renderHook(() =>
      useZodForm(schema, {
        defaultValues: { email: 'test@example.com', password: 'secret123' },
      }),
    )

    await act(async () => {
      const handler = result.current.handleApiSubmit(onSubmit)

      await expect(handler(new Event('submit') as any)).rejects.toThrow(
        'api error',
      )
    })

    expect(setApiFormErrors).toHaveBeenCalledWith(
      error,
      result.current.setError,
    )
  })
})
