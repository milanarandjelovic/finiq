import { HttpStatus } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

export class RefreshAccessTokenNotFoundDto {
  @ApiProperty({
    example: HttpStatus.NOT_FOUND,
  })
  statusCode: number

  @ApiProperty({
    example: 'Refresh token not found.',
  })
  message: string

  @ApiProperty({
    example: 'Not Found',
  })
  error: string
}
