import * as fs from 'node:fs'
import * as path from 'node:path'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Request } from 'express'
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
  ) {}

  async findAll(
    query: TransactionsFindAllPayloadDto,
    request: Request,
  ): Promise<RestfulResponseDto<TransactionsResponseDto>> {
    const { currentPage, perPage } = query

    const qb = this.transactionQueryBuilder.findAll(request.user.id)
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
    request: Request,
  ): Promise<RestfulResponseDto<TransactionResponseDto>> {
    const transaction = await this.transactionQueryBuilder
      .findOne(id, request.user.id)
      .getOne()

    if (!transaction) {
      throw new ValidationException([
        { property: 'id', messages: ['Transaction not found.'] },
      ])
    }

    return new RestfulResponseDto<TransactionResponseDto>({
      message: 'Successfully returned transaction.',
      data: { transaction },
    })
  }

  async create(
    data: CreateTransactionPayloadDto,
    request: Request,
  ): Promise<RestfulResponseDto<TransactionResponseDto>> {
    const { type, amount, date, note, categoryId } = data

    let category: Category | null = null

    if (categoryId) {
      category = await this.categoryRepository.findOne({
        where: { id: categoryId, user: { id: request.user.id } },
      })

      if (!category) {
        throw new ValidationException([
          { property: 'categoryId', messages: ['Category not found.'] },
        ])
      }
    }

    if (type === TransactionType.EXPENSE && !category) {
      throw new ValidationException([
        {
          property: 'categoryId',
          messages: ['Category is required for expense transactions.'],
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
        user: request.user,
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
    request: Request,
  ): Promise<RestfulResponseDto<TransactionResponseDto>> {
    const transaction = await this.transactionQueryBuilder
      .findOne(id, request.user.id)
      .getOne()

    if (!transaction) {
      throw new ValidationException([
        { property: 'id', messages: ['Transaction not found.'] },
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
          where: { id: data.categoryId, user: { id: request.user.id } },
        })

        if (!category) {
          throw new ValidationException([
            { property: 'categoryId', messages: ['Category not found.'] },
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
    request: Request,
  ): Promise<RestfulResponseDto<TransactionResponseDto>> {
    const transaction = await this.transactionQueryBuilder
      .findOne(id, request.user.id)
      .getOne()

    if (!transaction) {
      throw new ValidationException([
        { property: 'id', messages: ['Transaction not found.'] },
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
    request: Request,
  ): Promise<RestfulResponseDto<TransactionResponseDto>> {
    const transaction = await this.transactionQueryBuilder
      .findOne(id, request.user.id)
      .getOne()

    if (!transaction) {
      throw new ValidationException([
        { property: 'id', messages: ['Transaction not found.'] },
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
    request: Request,
  ): Promise<RestfulResponseDto<TransactionResponseDto>> {
    const transaction = await this.transactionQueryBuilder
      .findOne(id, request.user.id)
      .getOne()

    if (!transaction) {
      throw new ValidationException([
        { property: 'id', messages: ['Transaction not found.'] },
      ])
    }

    if (!transaction.receiptPath) {
      throw new ValidationException([
        { property: 'id', messages: ['Transaction has no receipt.'] },
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

  async getReceiptFilePath(id: string, request: Request): Promise<string> {
    const transaction = await this.transactionQueryBuilder
      .findOne(id, request.user.id)
      .getOne()

    if (!transaction) {
      throw new ValidationException([
        { property: 'id', messages: ['Transaction not found.'] },
      ])
    }

    if (!transaction.receiptPath) {
      throw new ValidationException([
        { property: 'id', messages: ['Transaction has no receipt.'] },
      ])
    }

    const filePath = path.join(UPLOADS_DIR, transaction.receiptPath)

    if (!fs.existsSync(filePath)) {
      throw new ValidationException([
        { property: 'id', messages: ['Receipt file not found.'] },
      ])
    }

    return filePath
  }
}
