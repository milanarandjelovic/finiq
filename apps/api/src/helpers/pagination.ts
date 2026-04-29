import { PAGINATION_PAGE_LIMIT, PAGINATION_PAGE_START } from '@finiq/shared'
import { PaginationMetadataDto } from '@/shared/dtos/pagination-metadata.dto'

export type PaginationMetadataProps = {
  total: number
  currentPage: number
  perPage: number
}

/**
 * Generate pagination metadata.
 *
 * @param {PaginationMetadataProps} param0
 * @returns {PaginationMetadataDto}
 */
export const generatePaginationMetadata = ({
  total,
  currentPage = PAGINATION_PAGE_START,
  perPage = PAGINATION_PAGE_LIMIT,
}: PaginationMetadataProps): PaginationMetadataDto => {
  const lastPage = Math.ceil(total / perPage)
  const nextPage = currentPage + 1 > lastPage ? null : currentPage + 1
  const previousPage = currentPage - 1 < 1 ? null : currentPage - 1

  return new PaginationMetadataDto({
    currentPage,
    lastPage: lastPage ?? currentPage,
    previousPage,
    nextPage,
    perPage,
    total,
  })
}
