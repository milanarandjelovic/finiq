import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { I18nService } from 'nestjs-i18n'
import { Repository } from 'typeorm'

import { ValidationException } from '@/exceptions/validation.exception'
import { generatePaginationMetadata } from '@/helpers/pagination'
import { BudgetQueryBuilder } from '@/modules/budget/builders/budget-query.builder'
import { BudgetQueryDto } from '@/modules/budget/dtos/budget-query.dto'
import {
  BudgetResponseDto,
  BudgetsCopiedResponseDto,
  BudgetsResponseDto,
} from '@/modules/budget/dtos/budget-response.dto'
import { CopyBudgetPayloadDto } from '@/modules/budget/dtos/copy-budget-payload.dto'
import { UpsertBudgetPayloadDto } from '@/modules/budget/dtos/upsert-budget-payload.dto'
import { Budget } from '@/modules/budget/entities/budget.entity'
import { Category } from '@/modules/category/entities/category.entity'
import { User } from '@/modules/user/entities/user.entity'
import { RestfulResponseDto } from '@/shared/dtos/restful-response.dto'

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget)
    private readonly budgetRepository: Repository<Budget>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly budgetQueryBuilder: BudgetQueryBuilder,
    private readonly i18n: I18nService,
  ) {}

  async findAll(
    query: BudgetQueryDto,
    userId: string,
  ): Promise<RestfulResponseDto<BudgetsResponseDto>> {
    const { month, year, currentPage, perPage, categoryName } = query

    const [budgets, total] = await this.budgetQueryBuilder
      .findAll(userId, month, year, categoryName)
      .skip((currentPage - 1) * perPage)
      .take(perPage)
      .getManyAndCount()

    budgets.sort((a, b) => a.category.sortOrder - b.category.sortOrder)

    return new RestfulResponseDto<BudgetsResponseDto>({
      message: 'Successfully returned all budgets.',
      data: {
        budgets: {
          data: budgets,
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

  async upsert(
    data: UpsertBudgetPayloadDto,
    userId: string,
  ): Promise<RestfulResponseDto<BudgetResponseDto>> {
    const { categoryId, month, year, amount } = data

    const category = await this.categoryRepository.findOne({
      where: { id: categoryId, user: { id: userId } },
    })

    if (!category) {
      throw new ValidationException([
        {
          property: 'categoryId',
          messages: [this.i18n.t('api.categoryNotFound')],
        },
      ])
    }

    let budget = await this.budgetQueryBuilder
      .findOne(userId, categoryId, month, year)
      .getOne()

    if (budget) {
      budget.amount = amount
      await this.budgetRepository.save(budget)
    } else {
      budget = await this.budgetRepository
        .create({ amount, month, year, category, user: { id: userId } as User })
        .save()
      budget.category = category
    }

    return new RestfulResponseDto<BudgetResponseDto>({
      message: 'Budget saved successfully.',
      data: { budget },
    })
  }

  async copyFromPreviousMonth(
    data: CopyBudgetPayloadDto,
    userId: string,
  ): Promise<RestfulResponseDto<BudgetsCopiedResponseDto>> {
    const { month, year } = data

    const sourceBudgets = await this.budgetQueryBuilder
      .findPreviousMonth(userId, month, year)
      .getMany()

    if (sourceBudgets.length === 0) {
      throw new ValidationException([
        {
          property: 'month',
          messages: [this.i18n.t('api.noPreviousMonthBudgets')],
        },
      ])
    }

    const copied: Budget[] = []
    for (const source of sourceBudgets) {
      let existing = await this.budgetQueryBuilder
        .findOne(userId, source.category.id, month, year)
        .getOne()

      if (existing) {
        existing.amount = source.amount
        await this.budgetRepository.save(existing)
        copied.push(existing)
      } else {
        existing = await this.budgetRepository
          .create({
            amount: source.amount,
            month,
            year,
            category: source.category,
            user: { id: userId } as User,
          })
          .save()
        copied.push(existing)
      }
    }

    return new RestfulResponseDto<BudgetsCopiedResponseDto>({
      message: `Copied ${copied.length} budgets from the previous month.`,
      data: {
        budgets: {
          data: copied,
          meta: {
            pagination: generatePaginationMetadata({
              currentPage: 1,
              perPage: copied.length,
              total: copied.length,
            }),
          },
        },
      },
    })
  }
}
