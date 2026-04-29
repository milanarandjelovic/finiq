import { ApiProperty } from '@nestjs/swagger'

export class UserNewPasswordMaxLengthDto {
  @ApiProperty({
    name: 'property',
    example: 'newPassword',
  })
  property: string

  @ApiProperty({
    example: ['Password must be at most 30 characters long.'],
  })
  messages: [string]
}
