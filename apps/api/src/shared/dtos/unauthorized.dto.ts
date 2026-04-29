import { HttpStatus } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

export class UnauthorizedDto {
  @ApiProperty({
    example: HttpStatus.UNAUTHORIZED,
  })
  statusCode: number

  @ApiProperty({
    example: 'Unauthorized',
  })
  message: string
}
