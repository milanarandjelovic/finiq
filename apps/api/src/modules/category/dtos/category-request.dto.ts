import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class CategoryRequestDto {
  @IsUUID()
  @ApiProperty({ example: 'c9cb1462-2f57-414a-aead-39ca4405e010' })
  id: string
}
