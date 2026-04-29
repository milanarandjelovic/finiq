import { ApiProperty } from '@nestjs/swagger'

export class UserPasswordUppercaseDto {
  @ApiProperty({
    name: 'property',
    example: 'password',
  })
  property: string

  @ApiProperty({
    example: ['Password must have one uppercase character.'],
  })
  messages: [string]
}
