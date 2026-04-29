import { ApiProperty } from '@nestjs/swagger'

import { UserResponseDto } from '@/modules/user/dtos/user-response.dto'

export class RefreshAccessTokenResponseDto extends UserResponseDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoic3VwZXItYWRtaW4iLCJpYXQiOjE2NzgwMTI2OTUsImV4cCI6MTY3ODkxMjY5NX0.tjUi7OBilDNnxWawPv5DZtg7awnzXR-2D5AbYW78od',
  })
  accessToken: string
}
