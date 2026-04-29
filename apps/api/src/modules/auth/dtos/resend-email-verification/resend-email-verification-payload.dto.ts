import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

import { IsNotExist } from '@/shared/decorators/is-not-exist.decorator'
import { IsUserVerifiedEmail } from '@/shared/decorators/is-user-verified-email.decorator'

export class ResendEmailVerificationPayloadDto {
  @IsEmail({}, { message: 'Email field must be a valid email address.' })
  @IsNotEmpty({
    always: true,
    message: 'Email should not be empty.',
  })
  @IsNotExist(
    { tableName: 'users', column: 'email' },
    { message: "This email isn't associated with an account." },
  )
  @IsUserVerifiedEmail(
    { column: 'email' },
    { message: 'Email is already verified.' },
  )
  @ApiProperty({
    required: true,
    example: 'john@doe.com',
  })
  email: string
}
