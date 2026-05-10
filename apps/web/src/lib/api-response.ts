/**
 * Unwraps the data from an API query result.
 *
 * Orval generates hooks whose `result.data` is typed as `AxiosResponse<T>`,
 * but the custom axios mutator returns `response.data` directly, so the
 * runtime value is already `T`. This helper replaces the inline `as T | undefined`
 * cast with an explicit, searchable call site.
 *
 * @example
 * const categories = unwrapApiResponse<CategoryControllerFindAll200>(result?.data)?.data?.categories
 */
export function unwrapApiResponse<T>(data: unknown): T | undefined {
  return data as T | undefined
}
