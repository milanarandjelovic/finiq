import { ApiProperty } from '@nestjs/swagger'

export class UserPasswordNumberDto {
  @ApiProperty({
    name: 'property',
    example: 'password',
  })
  property: string

  @ApiProperty({
    example: ['Password must have one number.'],
  })
  messages: [string]
}
