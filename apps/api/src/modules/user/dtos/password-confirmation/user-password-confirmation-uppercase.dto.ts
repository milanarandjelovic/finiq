import { ApiProperty } from '@nestjs/swagger'

export class UserPasswordConfirmationUppercaseDto {
  @ApiProperty({
    name: 'property',
    example: 'passwordConfirmation',
  })
  property: string

  @ApiProperty({
    example: ['Password confirmation must have one uppercase character.'],
  })
  messages: [string]
}
