import { ApiProperty } from '@nestjs/swagger'

import { User } from '@/modules/user/entities/user.entity'

export class UserDeleteResponseDto {
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
    },
  })
  users: {
    data: User[]
  }
}
