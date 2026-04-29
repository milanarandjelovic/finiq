import { ApiProperty } from '@nestjs/swagger'

export class UserNewPasswordLowercaseDto {
  @ApiProperty({
    name: 'property',
    example: 'newPassword',
  })
  property: string

  @ApiProperty({
    example: ['Password must have one lowercase character.'],
  })
  messages: [string]
}
