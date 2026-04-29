import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, SelectQueryBuilder } from 'typeorm'

import { Category } from '@/modules/category/entities/category.entity'

@Injectable()
export class CategoryQueryBuilder {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  findAll(userId: string): SelectQueryBuilder<Category> {
    return this.categoryRepository
      .createQueryBuilder('category')
      .where('category.user_id = :userId', { userId })
      .orderBy('category.sort_order', 'ASC')
      .addOrderBy('category.created_at', 'ASC')
  }

  findOne(id: string, userId: string): SelectQueryBuilder<Category> {
    return this.categoryRepository
      .createQueryBuilder('category')
      .where('category.id = :id', { id })
      .andWhere('category.user_id = :userId', { userId })
  }

  findAllGoals(userId: string): SelectQueryBuilder<Category> {
    return this.categoryRepository
      .createQueryBuilder('category')
      .where('category.user_id = :userId', { userId })
      .andWhere('category.is_goal = true')
      .orderBy('category.sort_order', 'ASC')
  }

  findAllNonGoals(userId: string): SelectQueryBuilder<Category> {
    return this.categoryRepository
      .createQueryBuilder('category')
      .where('category.user_id = :userId', { userId })
      .andWhere('category.is_goal = false')
      .orderBy('category.sort_order', 'ASC')
  }
}
