import { ApiProperty } from '@nestjs/swagger'

export class SettingsDataDto {
  @ApiProperty({ example: 'USD' })
  currency: string
}

export class SettingsResponseDto {
  @ApiProperty({ type: () => SettingsDataDto })
  settings: SettingsDataDto
}
