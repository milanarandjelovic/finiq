import { ApiProperty } from '@nestjs/swagger'

export class PaginationMetadataDto {
  @ApiProperty({
    example: 1,
  })
  currentPage: number

  @ApiProperty({
    example: 3,
  })
  lastPage: number

  @ApiProperty({
    example: 2,
  })
  nextPage: number

  @ApiProperty({
    example: 10,
  })
  perPage: number

  @ApiProperty({
    example: null,
  })
  previousPage: number

  @ApiProperty({
    example: 24,
  })
  total: number

  constructor(data: PaginationMetadataDto) {
    Object.assign(this, data)
  }
}

export class PaginationDto {
  @ApiProperty({
    type: PaginationMetadataDto,
  })
  pagination: PaginationMetadataDto
}
