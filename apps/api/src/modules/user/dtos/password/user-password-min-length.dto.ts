import { ApiProperty } from '@nestjs/swagger'

export class UserPasswordMinLengthDto {
  @ApiProperty({
    name: 'property',
    example: 'password',
  })
  property: string

  @ApiProperty({
    example: ['Password must be at least 8 characters long.'],
  })
  messages: [string]
}
