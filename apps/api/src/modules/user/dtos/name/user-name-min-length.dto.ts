import { ApiProperty } from '@nestjs/swagger'

export class UserNameMinLengthDto {
  @ApiProperty({
    name: 'property',
    example: 'name',
  })
  property: string

  @ApiProperty({
    example: ['Name must be at least 3 characters long.'],
  })
  messages: [string]
}
