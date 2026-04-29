import { ApiProperty } from '@nestjs/swagger'

export class UserEmailExistsDto {
  @ApiProperty({
    name: 'property',
    example: 'email',
  })
  property: string

  @ApiProperty({
    example: ['The email has already been taken.'],
  })
  messages: [string]
}
