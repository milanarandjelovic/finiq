import type {
  MutationOptions,
  QueryClient,
  QueryKey,
} from '@tanstack/react-query'
import { toast } from 'sonner'

import type {
  BackendValidationError,
  MinimalFormError,
} from '@/types/form-validation'

/**
 * Mutation options for CRUD operations.
 *
 * @param {QueryClient} qc - The query client instance.
 * @param {Object} options - The options for the mutation.
 * @param {QueryKey[]} options.queryKeys - The query keys to invalidate.
 * @param {string} options.successMessage - The success message to display.
 * @param {string} options.errorMessage - The error message to display.
 * @param {() => void} [options.onSuccess] - Optional callback function to be called on successful mutation.
 * @returns {Object} - The mutation options object.
 */
export function crudMutationOptions(
  qc: QueryClient,
  options: {
    queryKeys: QueryKey[]
    successMessage: string
    errorMessage: string
    onSuccess?: () => void
  },
): { mutation: { onSuccess: () => void; onError: () => void } } {
  return {
    mutation: {
      onSuccess() {
        options.queryKeys.forEach((queryKey) =>
          qc.invalidateQueries({ queryKey }),
        )
        toast.success(options.successMessage)
        options.onSuccess?.()
      },
      onError() {
        toast.error(options.errorMessage)
      },
    },
  }
}

/**
 * Applies backend validation errors to a form.
 */
export const applyValidationErrors = (
  form: MinimalFormError,
  errors?: BackendValidationError[],
): void => {
  errors?.forEach((error: BackendValidationError) => {
    if (!error.property) return
    const message = error.messages?.[0] || 'Invalid field'
    form.setError(error.property, { message })
  })
}

/**
 * Mutation options for form pages — maps 400 validation errors back onto the
 * form and calls an optional onSuccess callback.
 */
export function formMutationOptions<TSuccess>(
  form: MinimalFormError,
  onSuccess?: (response: TSuccess) => void,
): {
  mutation: MutationOptions<
    TSuccess,
    { statusCode?: number; errors?: BackendValidationError[] },
    unknown
  >
} {
  return {
    mutation: {
      onSuccess,
      onError(error: {
        statusCode?: number
        errors?: BackendValidationError[]
      }) {
        if (error.statusCode === 400) {
          applyValidationErrors(form, error.errors)
        }
      },
    },
  }
}
