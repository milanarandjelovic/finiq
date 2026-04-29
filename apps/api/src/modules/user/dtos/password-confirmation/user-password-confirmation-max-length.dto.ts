import { ApiProperty } from '@nestjs/swagger'

export class UserPasswordConfirmationMaxLengthDto {
  @ApiProperty({
    name: 'property',
    example: 'passwordConfirmation',
  })
  property: string

  @ApiProperty({
    example: ['Password confirmation must be at most 30 characters long.'],
  })
  messages: [string]
}
