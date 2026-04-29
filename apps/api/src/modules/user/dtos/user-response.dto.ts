import { ApiProperty } from '@nestjs/swagger'

import { User } from '@/modules/user/entities/user.entity'

export class UserResponseDto {
  @ApiProperty()
  user: User
}
