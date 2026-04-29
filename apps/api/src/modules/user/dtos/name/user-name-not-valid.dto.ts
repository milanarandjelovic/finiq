import { ApiProperty } from '@nestjs/swagger'

export class UserNameNotValidDto {
  @ApiProperty({
    name: 'property',
    example: 'name',
  })
  property: string

  @ApiProperty({
    example: ['Name must only contain letters and spaces.'],
  })
  messages: [string]
}
