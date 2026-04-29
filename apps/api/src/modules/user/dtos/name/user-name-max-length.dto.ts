import { ApiProperty } from '@nestjs/swagger'

export class UserNameMaxLengthDto {
  @ApiProperty({
    name: 'property',
    example: 'name',
  })
  property: string

  @ApiProperty({
    example: ['Name must be at most 30 characters long.'],
  })
  messages: [string]
}
