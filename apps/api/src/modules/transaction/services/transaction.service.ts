import * as fs from 'node:fs'
import * as path from 'node:path'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { I18nService } from 'nestjs-i18n'
import { Repository } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

import { TransactionType } from '@finiq/shared'
import { ValidationException } from '@/exceptions/validation.exception'
import { generatePaginationMetadata } from '@/helpers/pagination'
import { Category } from '@/modules/category/entities/category.entity'
import { TransactionQueryBuilder } from '@/modules/transaction/builders/transaction-query.builder'
import { CreateTransactionPayloadDto } from '@/modules/transaction/dtos/create-transaction-payload.dto'
import {
  TransactionResponseDto,
  TransactionsResponseDto,
} from '@/modules/transaction/dtos/transaction-response.dto'
import { TransactionsFindAllPayloadDto } from '@/modules/transaction/dtos/transactions-find-all-payload.dto'
import { UpdateTransactionPayloadDto } from '@/modules/transaction/dtos/update-transaction-payload.dto'
import { Transaction } from '@/modules/transaction/entities/transaction.entity'
import { User } from '@/modules/user/entities/user.entity'
import { RestfulResponseDto } from '@/shared/dtos/restful-response.dto'

const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'receipts')

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly transactionQueryBuilder: TransactionQueryBuilder,
    private readonly i18n: I18nService,
  ) {}

  async findAll(
    query: TransactionsFindAllPayloadDto,
    userId: string,
  ): Promise<RestfulResponseDto<TransactionsResponseDto>> {
    const { currentPage, perPage } = query

    const qb = this.transactionQueryBuilder.findAll(userId)
    this.transactionQueryBuilder.applyFilters(qb, query)

    const [transactions, total] = await qb
      .skip((currentPage - 1) * perPage)
      .take(perPage)
      .getManyAndCount()

    return new RestfulResponseDto<TransactionsResponseDto>({
      message: 'Successfully returned all transactions.',
      data: {
        transactions: {
          data: transactions,
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
  ): Promise<RestfulResponseDto<TransactionResponseDto>> {
    const transaction = await this.transactionQueryBuilder
      .findOne(id, userId)
      .getOne()

    if (!transaction) {
      throw new ValidationException([
        { property: 'id', messages: [this.i18n.t('api.transactionNotFound')] },
      ])
    }

    return new RestfulResponseDto<TransactionResponseDto>({
      message: 'Successfully returned transaction.',
      data: { transaction },
    })
  }

  async create(
    data: CreateTransactionPayloadDto,
    userId: string,
  ): Promise<RestfulResponseDto<TransactionResponseDto>> {
    const { type, amount, date, note, categoryId } = data

    let category: Category | null = null

    if (categoryId) {
      category = await this.categoryRepository.findOne({
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
    }

    if (type === TransactionType.EXPENSE && !category) {
      throw new ValidationException([
        {
          property: 'categoryId',
          messages: [this.i18n.t('api.categoryRequiredForExpense')],
        },
      ])
    }

    const transaction = await this.transactionRepository
      .create({
        type,
        amount,
        date: new Date(date),
        note: note ?? null,
        receiptPath: null,
        category,
        user: { id: userId } as User,
      })
      .save()

    return new RestfulResponseDto<TransactionResponseDto>({
      message: 'Transaction created successfully.',
      data: { transaction },
    })
  }

  async update(
    id: string,
    data: UpdateTransactionPayloadDto,
    userId: string,
  ): Promise<RestfulResponseDto<TransactionResponseDto>> {
    const transaction = await this.transactionQueryBuilder
      .findOne(id, userId)
      .getOne()

    if (!transaction) {
      throw new ValidationException([
        { property: 'id', messages: [this.i18n.t('api.transactionNotFound')] },
      ])
    }

    if (data.amount !== undefined) {
      transaction.amount = data.amount
    }

    if (data.date !== undefined) {
      transaction.date = new Date(data.date)
    }

    if (data.note !== undefined) {
      transaction.note = data.note ?? null
    }

    if (data.categoryId !== undefined) {
      if (data.categoryId === null) {
        transaction.category = null
      } else {
        const category = await this.categoryRepository.findOne({
          where: { id: data.categoryId, user: { id: userId } },
        })

        if (!category) {
          throw new ValidationException([
            {
              property: 'categoryId',
              messages: [this.i18n.t('api.categoryNotFound')],
            },
          ])
        }

        transaction.category = category
      }
    }

    await this.transactionRepository.save(transaction)

    return new RestfulResponseDto<TransactionResponseDto>({
      message: 'Transaction updated successfully.',
      data: { transaction },
    })
  }

  async delete(
    id: string,
    userId: string,
  ): Promise<RestfulResponseDto<TransactionResponseDto>> {
    const transaction = await this.transactionQueryBuilder
      .findOne(id, userId)
      .getOne()

    if (!transaction) {
      throw new ValidationException([
        { property: 'id', messages: [this.i18n.t('api.transactionNotFound')] },
      ])
    }

    if (transaction.receiptPath) {
      const filePath = path.join(UPLOADS_DIR, transaction.receiptPath)

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    }

    await this.transactionRepository.remove(transaction)

    return new RestfulResponseDto<TransactionResponseDto>({
      message: 'Transaction deleted successfully.',
      data: { transaction },
    })
  }

  async uploadReceipt(
    id: string,
    file: Express.Multer.File,
    userId: string,
  ): Promise<RestfulResponseDto<TransactionResponseDto>> {
    const transaction = await this.transactionQueryBuilder
      .findOne(id, userId)
      .getOne()

    if (!transaction) {
      throw new ValidationException([
        { property: 'id', messages: [this.i18n.t('api.transactionNotFound')] },
      ])
    }

    if (transaction.receiptPath) {
      const oldPath = path.join(UPLOADS_DIR, transaction.receiptPath)

      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath)
      }
    }

    fs.mkdirSync(UPLOADS_DIR, { recursive: true })

    const ext = path.extname(file.originalname).toLowerCase()
    const filename = `${uuidv4()}${ext}`
    fs.writeFileSync(path.join(UPLOADS_DIR, filename), file.buffer)

    transaction.receiptPath = filename
    await this.transactionRepository.save(transaction)

    return new RestfulResponseDto<TransactionResponseDto>({
      message: 'Receipt uploaded successfully.',
      data: { transaction },
    })
  }

  async deleteReceipt(
    id: string,
    userId: string,
  ): Promise<RestfulResponseDto<TransactionResponseDto>> {
    const transaction = await this.transactionQueryBuilder
      .findOne(id, userId)
      .getOne()

    if (!transaction) {
      throw new ValidationException([
        { property: 'id', messages: [this.i18n.t('api.transactionNotFound')] },
      ])
    }

    if (!transaction.receiptPath) {
      throw new ValidationException([
        {
          property: 'id',
          messages: [this.i18n.t('api.transactionHasNoReceipt')],
        },
      ])
    }

    const filePath = path.join(UPLOADS_DIR, transaction.receiptPath)
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)

    transaction.receiptPath = null
    await this.transactionRepository.save(transaction)

    return new RestfulResponseDto<TransactionResponseDto>({
      message: 'Receipt deleted successfully.',
      data: { transaction },
    })
  }

  async getReceiptFilePath(id: string, userId: string): Promise<string> {
    const transaction = await this.transactionQueryBuilder
      .findOne(id, userId)
      .getOne()

    if (!transaction) {
      throw new ValidationException([
        { property: 'id', messages: [this.i18n.t('api.transactionNotFound')] },
      ])
    }

    if (!transaction.receiptPath) {
      throw new ValidationException([
        {
          property: 'id',
          messages: [this.i18n.t('api.transactionHasNoReceipt')],
        },
      ])
    }

    const filePath = path.join(UPLOADS_DIR, transaction.receiptPath)

    if (!fs.existsSync(filePath)) {
      throw new ValidationException([
        { property: 'id', messages: [this.i18n.t('api.receiptFileNotFound')] },
      ])
    }

    return filePath
  }
}
