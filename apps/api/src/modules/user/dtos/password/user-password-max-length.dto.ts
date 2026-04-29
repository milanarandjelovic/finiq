import { ApiProperty } from '@nestjs/swagger'

export class UserPasswordMaxLengthDto {
  @ApiProperty({
    name: 'property',
    example: 'password',
  })
  property: string

  @ApiProperty({
    example: ['Password must be at most 30 characters long.'],
  })
  messages: [string]
}
