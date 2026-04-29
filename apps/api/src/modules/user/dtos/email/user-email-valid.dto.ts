import { ApiProperty } from '@nestjs/swagger'

export class UserEmailValidDto {
  @ApiProperty({
    name: 'property',
    example: 'email',
  })
  property: string

  @ApiProperty({
    example: ['Email field must be a valid email address.'],
  })
  messages: [string]
}
