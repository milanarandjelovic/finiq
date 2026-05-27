import type { QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { vi } from 'vitest'

import {
  applyValidationErrors,
  crudMutationOptions,
  formMutationOptions,
} from '@/lib/mutation'
import type {
  BackendValidationError,
  MinimalFormError,
} from '@/types/form-validation'

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

describe('applyValidationErrors', () => {
  let form: MinimalFormError

  beforeEach(() => {
    form = { setError: vi.fn() }
  })

  it('should call setError for each validation error', () => {
    const errors: BackendValidationError[] = [
      { property: 'email', messages: ['Email is required'] },
      { property: 'password', messages: ['Too short'] },
    ]

    applyValidationErrors(form, errors)

    expect(form.setError).toHaveBeenCalledTimes(2)
    expect(form.setError).toHaveBeenCalledWith('email', {
      message: 'Email is required',
    })
    expect(form.setError).toHaveBeenCalledWith('password', {
      message: 'Too short',
    })
  })

  it('should skip errors without a property', () => {
    applyValidationErrors(form, [
      { messages: ['Unknown'] },
      { property: 'email', messages: ['Required'] },
    ])

    expect(form.setError).toHaveBeenCalledTimes(1)
  })

  it('should use first message when multiple exist', () => {
    applyValidationErrors(form, [
      { property: 'name', messages: ['Too short', 'Must be unique'] },
    ])

    expect(form.setError).toHaveBeenCalledWith('name', { message: 'Too short' })
  })

  it('should do nothing when errors array is undefined', () => {
    applyValidationErrors(form, undefined)
    expect(form.setError).not.toHaveBeenCalled()
  })
})

describe('crudMutationOptions', () => {
  let qc: QueryClient

  beforeEach(() => {
    qc = { invalidateQueries: vi.fn() } as unknown as QueryClient
    vi.clearAllMocks()
  })

  it('should invalidate query keys on success', () => {
    const options = crudMutationOptions(qc, {
      queryKeys: [['transactions'], ['budgets']],
      successMessage: 'Deleted',
      errorMessage: 'Failed',
    })
    options.mutation.onSuccess()

    expect(qc.invalidateQueries).toHaveBeenCalledTimes(2)
    expect(qc.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['transactions'],
    })
    expect(qc.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['budgets'] })
  })

  it('should show success toast on success', () => {
    const options = crudMutationOptions(qc, {
      queryKeys: [['transactions']],
      successMessage: 'Transaction created',
      errorMessage: 'Failed',
    })
    options.mutation.onSuccess()

    expect(toast.success).toHaveBeenCalledWith('Transaction created')
  })

  it('should invoke onSuccess callback when provided', () => {
    const onSuccess = vi.fn()
    const options = crudMutationOptions(qc, {
      queryKeys: [['transactions']],
      successMessage: 'Done',
      errorMessage: 'Failed',
      onSuccess,
    })
    options.mutation.onSuccess()

    expect(onSuccess).toHaveBeenCalled()
  })

  it('should show error toast on error', () => {
    const options = crudMutationOptions(qc, {
      queryKeys: [['transactions']],
      successMessage: 'Done',
      errorMessage: 'Something went wrong',
    })
    options.mutation.onError()

    expect(toast.error).toHaveBeenCalledWith('Something went wrong')
  })
})

describe('formMutationOptions', () => {
  let form: MinimalFormError

  beforeEach(() => {
    form = { setError: vi.fn() }
  })

  it('should call onSuccess when mutation succeeds', () => {
    const onSuccess = vi.fn()
    const options = formMutationOptions(form, onSuccess)
    options.mutation.onSuccess?.(
      'response-data',
      undefined,
      undefined,
      undefined as any,
    )

    expect(onSuccess).toHaveBeenCalledWith(
      'response-data',
      undefined,
      undefined,
      undefined,
    )
  })

  it('should apply validation errors on 400', () => {
    const options = formMutationOptions(form)
    options.mutation.onError?.(
      {
        statusCode: 400,
        errors: [{ property: 'email', messages: ['Invalid email'] }],
      },
      undefined,
      undefined,
      undefined as any,
    )

    expect(form.setError).toHaveBeenCalledWith('email', {
      message: 'Invalid email',
    })
  })

  it('should not apply validation errors on non-400 errors', () => {
    const options = formMutationOptions(form)
    options.mutation.onError?.(
      {
        statusCode: 500,
        errors: [{ property: 'email', messages: ['Server error'] }],
      },
      undefined,
      undefined,
      undefined as any,
    )

    expect(form.setError).not.toHaveBeenCalled()
  })
})
