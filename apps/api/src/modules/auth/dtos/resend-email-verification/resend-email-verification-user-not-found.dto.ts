import { ApiProperty } from '@nestjs/swagger'

export class ResendEmailVerificationUserNotFoundDto {
  @ApiProperty({
    example: 'email',
  })
  property: string

  @ApiProperty({
    example: ['User with this email is not found.'],
  })
  messages: [string]
}
