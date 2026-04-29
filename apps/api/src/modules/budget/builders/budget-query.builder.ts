import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, SelectQueryBuilder } from 'typeorm'

import { Budget } from '@/modules/budget/entities/budget.entity'

@Injectable()
export class BudgetQueryBuilder {
  constructor(
    @InjectRepository(Budget)
    private readonly budgetRepository: Repository<Budget>,
  ) {}

  findAll(
    userId: string,
    month: number,
    year: number,
    categoryName?: string,
  ): SelectQueryBuilder<Budget> {
    const queryBuilder = this.budgetRepository
      .createQueryBuilder('budget')
      .innerJoinAndSelect('budget.category', 'category')
      .where('budget.user_id = :userId', { userId })
      .andWhere('budget.month = :month', { month })
      .andWhere('budget.year = :year', { year })

    if (categoryName) {
      queryBuilder.andWhere('category.name ILIKE :categoryName', {
        categoryName: `%${categoryName}%`,
      })
    }

    return queryBuilder
  }

  findOne(
    userId: string,
    categoryId: string,
    month: number,
    year: number,
  ): SelectQueryBuilder<Budget> {
    return this.budgetRepository
      .createQueryBuilder('budget')
      .innerJoinAndSelect('budget.category', 'category')
      .where('budget.user_id = :userId', { userId })
      .andWhere('budget.category_id = :categoryId', { categoryId })
      .andWhere('budget.month = :month', { month })
      .andWhere('budget.year = :year', { year })
  }

  findPreviousMonth(
    userId: string,
    month: number,
    year: number,
  ): SelectQueryBuilder<Budget> {
    const sourceMonth = month === 1 ? 12 : month - 1
    const sourceYear = month === 1 ? year - 1 : year

    return this.budgetRepository
      .createQueryBuilder('budget')
      .innerJoinAndSelect('budget.category', 'category')
      .where('budget.user_id = :userId', { userId })
      .andWhere('budget.month = :month', { month: sourceMonth })
      .andWhere('budget.year = :year', { year: sourceYear })
  }
}
