import { ApiProperty } from '@nestjs/swagger'

export class UserPasswordConfirmationMinLengthDto {
  @ApiProperty({
    name: 'property',
    example: 'passwordConfirmation',
  })
  property: string

  @ApiProperty({
    example: ['Password confirmation must be at least 8 characters long.'],
  })
  messages: [string]
}
