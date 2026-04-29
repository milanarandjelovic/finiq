import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { Request } from 'express'

import { TransformInterceptor } from '@/interceptors/transform.interceptor'
import { JwtAuthenticationGuard } from '@/modules/auth/guards/jwt-authentication.guard'
import { CategoriesFindAllPayloadDto } from '@/modules/category/dtos/categories-find-all-payload.dto'
import { CategoryRequestDto } from '@/modules/category/dtos/category-request.dto'
import {
  CategoriesResponseDto,
  CategoryResponseDto,
} from '@/modules/category/dtos/category-response.dto'
import { CreateCategoryPayloadDto } from '@/modules/category/dtos/create-category-payload.dto'
import { UpdateCategoryPayloadDto } from '@/modules/category/dtos/update-category-payload.dto'
import { CategoryService } from '@/modules/category/services/category.service'
import { ApiRestfulResponse } from '@/shared/decorators/api-restful-response.decorator'
import { RestfulResponseDto } from '@/shared/dtos/restful-response.dto'
import { UnauthorizedDto } from '@/shared/dtos/unauthorized.dto'

@Controller('categories')
@ApiTags('Categories')
@UseInterceptors(TransformInterceptor)
@ApiBearerAuth('JwtToken')
@UseGuards(JwtAuthenticationGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories for the authenticated user' })
  @HttpCode(HttpStatus.OK)
  @ApiRestfulResponse({
    status: HttpStatus.OK,
    model: CategoriesResponseDto,
    description: 'Successfully returned all categories.',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedDto,
    description: 'Unauthorized',
  })
  async findAll(
    @Query() query: CategoriesFindAllPayloadDto,
    @Req() request: Request,
  ): Promise<RestfulResponseDto<CategoriesResponseDto>> {
    return this.categoryService.findAll(query, request)
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get a category by id' })
  @HttpCode(HttpStatus.OK)
  @ApiRestfulResponse({
    status: HttpStatus.OK,
    model: CategoryResponseDto,
    description: 'Successfully returned category.',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedDto,
    description: 'Unauthorized',
  })
  async findOne(
    @Param() params: CategoryRequestDto,
    @Req() request: Request,
  ): Promise<RestfulResponseDto<CategoryResponseDto>> {
    return this.categoryService.findOne(params.id, request)
  }

  @Post()
  @ApiOperation({ summary: 'Create a category' })
  @HttpCode(HttpStatus.CREATED)
  @ApiRestfulResponse({
    status: HttpStatus.CREATED,
    model: CategoryResponseDto,
    description: 'Category created successfully.',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedDto,
    description: 'Unauthorized',
  })
  async create(
    @Body() body: CreateCategoryPayloadDto,
    @Req() request: Request,
  ): Promise<RestfulResponseDto<CategoryResponseDto>> {
    return this.categoryService.create(body, request)
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update a category' })
  @HttpCode(HttpStatus.OK)
  @ApiRestfulResponse({
    status: HttpStatus.OK,
    model: CategoryResponseDto,
    description: 'Category updated successfully.',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedDto,
    description: 'Unauthorized',
  })
  async update(
    @Param() params: CategoryRequestDto,
    @Body() body: UpdateCategoryPayloadDto,
    @Req() request: Request,
  ): Promise<RestfulResponseDto<CategoryResponseDto>> {
    return this.categoryService.update(params.id, body, request)
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a category' })
  @HttpCode(HttpStatus.OK)
  @ApiRestfulResponse({
    status: HttpStatus.OK,
    model: CategoryResponseDto,
    description: 'Category deleted successfully.',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedDto,
    description: 'Unauthorized',
  })
  async delete(
    @Param() params: CategoryRequestDto,
    @Req() request: Request,
  ): Promise<RestfulResponseDto<CategoryResponseDto>> {
    return this.categoryService.delete(params.id, request)
  }
}
