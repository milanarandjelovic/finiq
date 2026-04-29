import { ApiProperty } from '@nestjs/swagger'

export class LocaleNotFoundDto {
  @ApiProperty({
    example: 404,
  })
  statusCode: number

  @ApiProperty({
    example: 'Locale "fr" not found',
  })
  message: string
}
