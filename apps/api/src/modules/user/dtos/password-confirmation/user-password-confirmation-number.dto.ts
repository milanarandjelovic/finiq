import { ApiProperty } from '@nestjs/swagger'

export class UserPasswordConfirmationNumberDto {
  @ApiProperty({
    name: 'property',
    example: 'passwordConfirmation',
  })
  property: string

  @ApiProperty({
    example: ['Password confirmation must have one number.'],
  })
  messages: [string]
}
