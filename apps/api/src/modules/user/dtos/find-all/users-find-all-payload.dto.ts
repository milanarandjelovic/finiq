import { ApiProperty } from '@nestjs/swagger'

import { PAGINATION_PAGE_LIMIT, PAGINATION_PAGE_START } from '@finiq/shared'

export class UsersFindAllPayloadDto {
  @ApiProperty({
    example: 10,
    default: PAGINATION_PAGE_LIMIT,
  })
  perPage: number = PAGINATION_PAGE_LIMIT

  @ApiProperty({
    example: 1,
    default: PAGINATION_PAGE_START,
  })
  currentPage: number = PAGINATION_PAGE_START

  @ApiProperty({
    example: 'John Doe',
    required: false,
  })
  name?: string
}
