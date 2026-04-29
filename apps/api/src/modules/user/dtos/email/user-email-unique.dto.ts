import { ApiProperty } from '@nestjs/swagger'

export class UserEmailUniqueDto {
  @ApiProperty({
    name: 'property',
    example: 'email',
  })
  property: string

  @ApiProperty({
    example: [
      'It looks like an account with this email already exists. Try logging in or use another email address.',
    ],
  })
  messages: [string]
}
