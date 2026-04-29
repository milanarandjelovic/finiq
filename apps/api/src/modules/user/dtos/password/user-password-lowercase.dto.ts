import { ApiProperty } from '@nestjs/swagger'

export class UserPasswordLowercaseDto {
  @ApiProperty({
    name: 'property',
    example: 'password',
  })
  property: string

  @ApiProperty({
    example: ['Password must have one lowercase character.'],
  })
  messages: [string]
}
