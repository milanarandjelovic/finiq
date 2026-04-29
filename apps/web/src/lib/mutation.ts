import type { QueryClient, QueryKey } from '@tanstack/react-query'
import { toast } from 'sonner'

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
