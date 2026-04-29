import type {
  BackendValidationError,
  MinimalFormError,
} from '@/types/form-validation'
import {MutationOptions} from "@tanstack/react-query";

/**
 * Applies validation errors to a form.
 *
 * @param {MinimalFormError} form - The form to apply validation errors to.
 * @param {BackendValidationError[]} [errors] - Optional array of validation errors.
 * @returns {void}
 */
export const applyValidationErrors = (
  form: MinimalFormError,
  errors?: BackendValidationError[],
): void => {
  errors?.forEach((error: BackendValidationError) => {
    if (!error.property) {
      return
    }

    const message = error.messages?.[0] || 'Invalid field'
    form.setError(error.property, { message })
  })
}

/**
 * Form mutation options with validation.
 *
 * @param {MinimalFormError} form - The form to apply validation errors to.
 * @param {() => void} [onSuccess] - Optional callback function to be called on successful mutation.
 * @returns {MutationOptions} - The mutation options object.
 */
export function formMutationOptions<TSuccess>(
  form: MinimalFormError,
  onSuccess?: (response: TSuccess) => void,
) : {mutation: MutationOptions<TSuccess, { statusCode?: number; errors?: BackendValidationError[] }, unknown>} {
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
