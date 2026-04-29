import { ApiProperty } from '@nestjs/swagger'

export class HealthResponseDto {
  @ApiProperty({
    example: 'ok',
  })
  status: string

  @ApiProperty({
    example: '2025-12-26T10:30:00.000Z',
  })
  timestamp: string

  @ApiProperty({
    example: 'production',
  })
  environment: string

  @ApiProperty({
    example: '1.0.0',
  })
  version: string
}
