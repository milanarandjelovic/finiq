import { ApiProperty } from '@nestjs/swagger'

export class CheckEmailVerificationResponseDto {
  @ApiProperty()
  alreadyActivated: boolean
}
