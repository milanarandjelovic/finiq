import { ApiProperty } from '@nestjs/swagger'

export class UserCannotDeleteYourselfDto {
  @ApiProperty({
    name: 'property',
    example: 'id',
  })
  property: string

  @ApiProperty({
    example: ['You cannot delete yourself.'],
  })
  messages: [string]
}
