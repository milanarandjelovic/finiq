import { ApiProperty } from '@nestjs/swagger'

export class UserNewPasswordMinLengthDto {
  @ApiProperty({
    name: 'property',
    example: 'newPassword',
  })
  property: string

  @ApiProperty({
    example: ['Password must be at least 8 characters long.'],
  })
  messages: [string]
}
