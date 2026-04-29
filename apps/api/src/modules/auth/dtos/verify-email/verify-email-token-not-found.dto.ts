import { ApiProperty } from '@nestjs/swagger'

export class VerifyEmailTokenNotFoundDto {
  @ApiProperty({
    example: 'token',
  })
  property: string

  @ApiProperty({
    example: ['Verify email token is not valid.'],
  })
  messages: [string]
}
