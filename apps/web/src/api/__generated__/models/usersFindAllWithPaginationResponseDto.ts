import type { PaginationDto } from './paginationDto'
import type { User } from './user'

export interface UsersFindAllWithPaginationResponseDto {
  data: User[]
  meta: PaginationDto
}
