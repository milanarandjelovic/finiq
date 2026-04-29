import { ApiProperty } from '@nestjs/swagger'

export class LogoutResponseDto {
  @ApiProperty({
    example: true,
  })
  logout: boolean
}
