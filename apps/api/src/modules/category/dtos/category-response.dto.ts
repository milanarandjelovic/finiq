import { ApiProperty } from '@nestjs/swagger'

import { Category } from '@/modules/category/entities/category.entity'
import {
  PaginationDto,
  PaginationMetadataDto,
} from '@/shared/dtos/pagination-metadata.dto'

export class CategoryResponseDto {
  @ApiProperty({ type: () => Category })
  category: Category
}

export class CategoriesWithPaginationResponseDto {
  @ApiProperty({ type: () => [Category] })
  data: Category[]

  @ApiProperty({ type: PaginationDto })
  meta: { pagination: PaginationMetadataDto }
}

export class CategoriesResponseDto {
  @ApiProperty({ type: () => CategoriesWithPaginationResponseDto })
  categories: CategoriesWithPaginationResponseDto
}
