import { ApiProperty } from '@nestjs/swagger'

export class UserNotFoundDto {
  @ApiProperty({
    name: 'property',
    example: 'id',
  })
  property: string

  @ApiProperty({
    example: ['User not found.'],
  })
  messages: [string]
}
