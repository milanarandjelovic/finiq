import { ApiProperty } from '@nestjs/swagger'

export class ResetPasswordTokenNotFoundDto {
  @ApiProperty({
    example: 'token',
  })
  property: string

  @ApiProperty({
    example: ['Reset password token not found.'],
  })
  messages: [string]
}
