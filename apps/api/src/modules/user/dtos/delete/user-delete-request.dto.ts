import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class UserDeleteRequestDto {
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    example:
      '6fc6c862-6c9d-4cc1-9b2e-ba49ae5add9f, 6fc6c862-6c9d-4cc1-9b2e-ba49ae5add9f',
  })
  ids: string
}
