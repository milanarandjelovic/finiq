import { ApiProperty } from '@nestjs/swagger'

export class UserNewPasswordNumberDto {
  @ApiProperty({
    name: 'property',
    example: 'newPassword',
  })
  property: string

  @ApiProperty({
    example: ['Password must have one number.'],
  })
  messages: [string]
}
