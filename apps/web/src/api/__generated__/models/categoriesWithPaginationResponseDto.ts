import type { Category } from './category'
import type { PaginationDto } from './paginationDto'

export interface CategoriesWithPaginationResponseDto {
  data: Category[]
  meta: PaginationDto
}
