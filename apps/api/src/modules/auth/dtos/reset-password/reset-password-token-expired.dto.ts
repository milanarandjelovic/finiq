import { ApiProperty } from '@nestjs/swagger'

export class ResetPasswordTokenExpiredDto {
  @ApiProperty({
    example: 'token',
  })
  property: string

  @ApiProperty({
    example: ['Reset password token is expired.'],
  })
  messages: [string]
}
