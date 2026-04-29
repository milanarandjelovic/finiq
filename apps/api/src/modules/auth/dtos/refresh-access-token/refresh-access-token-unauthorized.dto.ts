import { HttpStatus } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

export class RefreshAccessTokenUnauthorizedDto {
  @ApiProperty({
    example: HttpStatus.UNAUTHORIZED,
  })
  statusCode: number

  @ApiProperty({
    example: 'You are not authorized to refresh access token.',
  })
  message: string

  @ApiProperty({
    example: 'Unauthorized',
  })
  error: string
}
