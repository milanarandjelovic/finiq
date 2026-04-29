import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsUUID } from 'class-validator'

import { IsNotExist } from '@/shared/decorators/is-not-exist.decorator'

export class UserRequestDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    required: true,
    example: '6fc6c862-6c9d-4cc1-9b2e-ba49ae5add9f',
  })
  @IsNotExist(
    { tableName: 'users', column: 'id' },
    { message: 'User not found.' },
  )
  id: string
}
