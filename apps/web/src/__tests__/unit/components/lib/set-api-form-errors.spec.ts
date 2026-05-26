import { vi } from 'vitest'

import { setApiFormErrors } from '@/lib/set-api-form-errors'

describe('setApiFormErrors', () => {
  let setError: ReturnType<typeof vi.fn>

  beforeEach(() => {
    setError = vi.fn()
  })

  it('should return false when error is not an object', () => {
    expect(setApiFormErrors('Internal error', setError)).toBe(false)
    expect(setError).not.toHaveBeenCalled()
  })

  it('should return false when error is null', () => {
    expect(setApiFormErrors(null, setError)).toBe(false)
  })

  it('should return false when error has no errors property', () => {
    expect(setApiFormErrors({ message: 'Network error' }, setError)).toBe(false)
  })

  it('should return false when errors is not an array', () => {
    expect(setApiFormErrors({ errors: 'not-an-array' }, setError)).toBe(false)
  })

  it('should set field errors from validation error array', () => {
    const result = setApiFormErrors(
      {
        errors: [{ property: 'email', messages: ['Email is required'] }],
      },
      setError,
    )

    expect(result).toBe(true)
    expect(setError).toHaveBeenCalledWith('email', {
      message: 'Email is required',
    })
  })

  it('should set multiple field errors', () => {
    setApiFormErrors(
      {
        errors: [
          { property: 'email', messages: ['Email is required'] },
          { property: 'password', messages: ['Password is too short'] },
        ],
      },
      setError,
    )

    expect(setError).toHaveBeenCalledTimes(2)
  })

  it('should skip errors without messages', () => {
    setApiFormErrors(
      {
        errors: [
          { property: 'email', messages: [] },
          { property: 'password', messages: ['Required'] },
        ],
      },
      setError,
    )

    expect(setError).toHaveBeenCalledTimes(1)
    expect(setError).toHaveBeenCalledWith('password', { message: 'Required' })
  })

  it('should skip errors without property', () => {
    setApiFormErrors(
      {
        errors: [
          { messages: ['Unknown error'] },
          { property: 'email', messages: ['Required'] },
        ],
      },
      setError,
    )

    expect(setError).toHaveBeenCalledTimes(1)
  })

  it('should return true when at least one error was set', () => {
    const result = setApiFormErrors(
      { errors: [{ property: 'email', messages: ['Required'] }] },
      setError,
    )

    expect(result).toBe(true)
  })

  it('should use first message when multiple messages exist', () => {
    setApiFormErrors(
      {
        errors: [
          {
            property: 'password',
            messages: ['Too short', 'Must include a number'],
          },
        ],
      },
      setError,
    )

    expect(setError).toHaveBeenCalledWith('password', { message: 'Too short' })
  })
})
