import { ApiProperty } from '@nestjs/swagger'

export class UserPasswordConfirmationLowercaseDto {
  @ApiProperty({
    name: 'property',
    example: 'passwordConfirmation',
  })
  property: string

  @ApiProperty({
    example: ['Password confirmation must have one lowercase character.'],
  })
  messages: [string]
}
