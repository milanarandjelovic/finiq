import { ApiProperty } from '@nestjs/swagger'

export class VerifyEmailTokenExpiredDto {
  @ApiProperty({
    example: 'token',
  })
  property: string

  @ApiProperty({
    example: ['Verify email token is expired.'],
  })
  messages: [string]
}
