import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

import { IsNotExist } from '@/shared/decorators/is-not-exist.decorator'

export class ForgotPasswordPayloadDto {
  @IsEmail({}, { message: 'Email field must be a valid email address.' })
  @IsNotEmpty({
    always: true,
    message: 'Email should not be empty.',
  })
  @IsNotExist(
    { tableName: 'users', column: 'email' },
    { message: 'User with this email is not found.' },
  )
  @ApiProperty({
    required: true,
    example: 'john@email.com',
  })
  email: string
}
