import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { I18nService } from 'nestjs-i18n'
import { Repository } from 'typeorm'

import { ValidationException } from '@/exceptions/validation.exception'
import { generatePaginationMetadata } from '@/helpers/pagination'
import { CategoryQueryBuilder } from '@/modules/category/builders/category-query.builder'
import { CategoriesFindAllPayloadDto } from '@/modules/category/dtos/categories-find-all-payload.dto'
import {
  CategoriesResponseDto,
  CategoryResponseDto,
} from '@/modules/category/dtos/category-response.dto'
import { CreateCategoryPayloadDto } from '@/modules/category/dtos/create-category-payload.dto'
import { UpdateCategoryPayloadDto } from '@/modules/category/dtos/update-category-payload.dto'
import { Category } from '@/modules/category/entities/category.entity'
import { User } from '@/modules/user/entities/user.entity'
import { RestfulResponseDto } from '@/shared/dtos/restful-response.dto'

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly categoryQueryBuilder: CategoryQueryBuilder,
    private readonly i18n: I18nService,
  ) {}

  async findAll(
    query: CategoriesFindAllPayloadDto,
    userId: string,
  ): Promise<RestfulResponseDto<CategoriesResponseDto>> {
    const { isGoal, name, currentPage, perPage } = query

    let baseQuery = this.categoryQueryBuilder.findAll(userId)

    if (isGoal === 1) {
      baseQuery = baseQuery.andWhere('category.is_goal = true')
    } else if (isGoal === 0) {
      baseQuery = baseQuery.andWhere('category.is_goal = false')
    }

    if (name) {
      baseQuery = baseQuery.andWhere('LOWER(category.name) LIKE LOWER(:name)', {
        name: `%${name}%`,
      })
    }

    const [categories, total] = await baseQuery
      .skip((currentPage - 1) * perPage)
      .take(perPage)
      .getManyAndCount()

    return new RestfulResponseDto<CategoriesResponseDto>({
      message: 'Successfully returned all categories.',
      data: {
        categories: {
          data: categories,
          meta: {
            pagination: generatePaginationMetadata({
              currentPage,
              perPage,
              total,
            }),
          },
        },
      },
    })
  }

  async findOne(
    id: string,
    userId: string,
  ): Promise<RestfulResponseDto<CategoryResponseDto>> {
    const category = await this.categoryQueryBuilder
      .findOne(id, userId)
      .getOne()

    if (!category) {
      throw new ValidationException([
        { property: 'id', messages: [this.i18n.t('api.categoryNotFound')] },
      ])
    }

    return new RestfulResponseDto<CategoryResponseDto>({
      message: 'Successfully returned category.',
      data: { category },
    })
  }

  async create(
    data: CreateCategoryPayloadDto,
    userId: string,
  ): Promise<RestfulResponseDto<CategoryResponseDto>> {
    const {
      name,
      emoji,
      color,
      budgetAmount,
      isGoal,
      targetAmount,
      targetDate,
      sortOrder,
    } = data

    const category = await this.categoryRepository
      .create({
        name,
        emoji,
        color,
        budgetAmount: budgetAmount ?? 0,
        isGoal: isGoal ?? false,
        targetAmount: targetAmount ?? null,
        targetDate: targetDate ? new Date(targetDate) : null,
        sortOrder: sortOrder ?? 0,
        user: { id: userId } as User,
      })
      .save()

    return new RestfulResponseDto<CategoryResponseDto>({
      message: 'Category created successfully.',
      data: { category },
    })
  }

  async update(
    id: string,
    data: UpdateCategoryPayloadDto,
    userId: string,
  ): Promise<RestfulResponseDto<CategoryResponseDto>> {
    const category = await this.categoryQueryBuilder
      .findOne(id, userId)
      .getOne()

    if (!category) {
      throw new ValidationException([
        { property: 'id', messages: [this.i18n.t('api.categoryNotFound')] },
      ])
    }

    if (data.name !== undefined) {
      category.name = data.name
    }

    if (data.emoji !== undefined) {
      category.emoji = data.emoji
    }

    if (data.color !== undefined) {
      category.color = data.color
    }

    if (data.budgetAmount !== undefined) {
      category.budgetAmount = data.budgetAmount
    }

    if (data.isGoal !== undefined) {
      category.isGoal = data.isGoal
    }

    if (data.targetAmount !== undefined) {
      category.targetAmount = data.targetAmount
    }

    if (data.targetDate !== undefined) {
      category.targetDate = data.targetDate ? new Date(data.targetDate) : null
    }

    if (data.sortOrder !== undefined) {
      category.sortOrder = data.sortOrder
    }

    await this.categoryRepository.save(category)

    return new RestfulResponseDto<CategoryResponseDto>({
      message: 'Category updated successfully.',
      data: {
        category,
      },
    })
  }

  async delete(
    id: string,
    userId: string,
  ): Promise<RestfulResponseDto<CategoryResponseDto>> {
    const category = await this.categoryQueryBuilder
      .findOne(id, userId)
      .getOne()

    if (!category) {
      throw new ValidationException([
        { property: 'id', messages: [this.i18n.t('api.categoryNotFound')] },
      ])
    }

    await this.categoryRepository.remove(category)

    return new RestfulResponseDto<CategoryResponseDto>({
      message: 'Category deleted successfully.',
      data: { category },
    })
  }
}
