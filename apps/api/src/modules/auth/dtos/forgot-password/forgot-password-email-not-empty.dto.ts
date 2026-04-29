import { ApiProperty } from '@nestjs/swagger'

export class ForgotPasswordEmailNotEmptyDto {
  @ApiProperty({
    example: 'email',
  })
  property: string

  @ApiProperty({
    example: ['Email should not be empty.'],
  })
  messages: [string]
}
