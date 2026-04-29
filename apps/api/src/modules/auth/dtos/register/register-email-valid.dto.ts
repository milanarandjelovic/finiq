import { ApiProperty } from '@nestjs/swagger'

export class RegisterEmailValidDto {
  @ApiProperty({
    example: 'email',
  })
  property: string

  @ApiProperty({
    example: ['Email field must be a valid email address.'],
  })
  messages: [string]
}
