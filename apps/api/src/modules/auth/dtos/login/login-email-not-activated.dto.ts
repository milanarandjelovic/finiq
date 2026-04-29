import { ApiProperty } from '@nestjs/swagger'

export class LoginEmailNotActivatedDto {
  @ApiProperty({
    example: 'email',
  })
  property: string

  @ApiProperty({
    example: [
      "It looks like your account isn't activated yet. Please check your inbox for the activation email we sent you.",
    ],
  })
  messages: [string]
}
