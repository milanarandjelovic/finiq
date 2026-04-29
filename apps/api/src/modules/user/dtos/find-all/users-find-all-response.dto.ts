import { ApiProperty } from '@nestjs/swagger'

import { User } from '@/modules/user/entities/user.entity'
import { PaginationDto } from '@/shared/dtos/pagination-metadata.dto'

export class UsersFindAllWithPaginationResponseDto {
  @ApiProperty({
    isArray: true,
    type: User,
  })
  data: User[]

  @ApiProperty({
    type: PaginationDto,
  })
  meta: PaginationDto
}

export class UsersFindAllResponseDto {
  @ApiProperty({
    example: {
      data: [
        {
          id: '36f810a3-2595-45a5-826a-59311581ae9b',
          name: 'John Doe',
          email: 'john.doe@email.com',
          createdAt: '2023-03-27T02:01:50.959Z',
          updatedAt: '2023-03-27T02:01:50.959Z',
        },
        {
          id: '36f810a3-2595-45a5-826a-59311581ae9b',
          name: 'Jane Doe',
          email: 'jane.doe@email.com',
          createdAt: '2023-03-27T02:01:50.959Z',
          updatedAt: '2023-03-27T02:01:50.959Z',
        },
      ],
      meta: {
        pagination: {
          currentPage: 1,
          lastPage: 3,
          nextPage: 2,
          perPage: 10,
          previousPage: null,
          total: 24,
        },
      },
    },
  })
  users: UsersFindAllWithPaginationResponseDto
}
