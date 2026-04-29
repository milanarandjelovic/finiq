import { ApiProperty } from '@nestjs/swagger'

export class RegisterEmailExistsDto {
  @ApiProperty({
    example: 'email',
  })
  property: string

  @ApiProperty({
    example: ['The email has already been taken.'],
  })
  messages: [string]
}
