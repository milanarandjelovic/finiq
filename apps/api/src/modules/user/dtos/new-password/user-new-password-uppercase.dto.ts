import { ApiProperty } from '@nestjs/swagger'

export class UserNewPasswordUppercaseDto {
  @ApiProperty({
    name: 'property',
    example: 'newPassword',
  })
  property: string

  @ApiProperty({
    example: ['Password must have one uppercase character.'],
  })
  messages: [string]
}
