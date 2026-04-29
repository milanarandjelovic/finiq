import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, SelectQueryBuilder } from 'typeorm'

import { TransactionsFindAllPayloadDto } from '@/modules/transaction/dtos/transactions-find-all-payload.dto'
import { Transaction } from '@/modules/transaction/entities/transaction.entity'

@Injectable()
export class TransactionQueryBuilder {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  findAll(userId: string): SelectQueryBuilder<Transaction> {
    return this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.category', 'category')
      .where('transaction.user_id = :userId', { userId })
      .orderBy('transaction.date', 'DESC')
      .addOrderBy('transaction.createdAt', 'DESC')
  }

  findOne(id: string, userId: string): SelectQueryBuilder<Transaction> {
    return this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.category', 'category')
      .where('transaction.id = :id', { id })
      .andWhere('transaction.user_id = :userId', { userId })
  }

  applyFilters(
    queryBuilder: SelectQueryBuilder<Transaction>,
    query: TransactionsFindAllPayloadDto,
  ): void {
    if (query.month) {
      queryBuilder.andWhere('EXTRACT(MONTH FROM transaction.date) = :month', {
        month: query.month,
      })
    }

    if (query.year) {
      queryBuilder.andWhere('EXTRACT(YEAR FROM transaction.date) = :year', {
        year: query.year,
      })
    }

    if (query.type) {
      queryBuilder.andWhere('transaction.type = :type', { type: query.type })
    }

    if (query.categoryId) {
      queryBuilder.andWhere('transaction.category_id = :categoryId', {
        categoryId: query.categoryId,
      })
    }

    if (query.categoryName) {
      queryBuilder.andWhere('category.name ILIKE :categoryName', {
        categoryName: `%${query.categoryName}%`,
      })
    }
  }
}
