import * as fs from 'node:fs'
import * as path from 'node:path'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { I18nService } from 'nestjs-i18n'
import { Repository } from 'typeorm'

import { Category } from '@/modules/category/entities/category.entity'
import { TransactionQueryBuilder } from '@/modules/transaction/builders/transaction-query.builder'
import { Transaction } from '@/modules/transaction/entities/transaction.entity'
import { TransactionService } from '@/modules/transaction/services/transaction.service'

describe('TransactionService', () => {
  let service: TransactionService
  let transactionRepository: jest.Mocked<Repository<Transaction>>
  let categoryRepository: jest.Mocked<Repository<Category>>

  const mockQueryBuilder: any = {
    findAll: jest.fn().mockReturnThis(),
    findOne: jest.fn().mockReturnThis(),
    applyFilters: jest.fn(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
    getOne: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Category),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: TransactionQueryBuilder,
          useValue: mockQueryBuilder,
        },
        {
          provide: I18nService,
          useValue: { t: jest.fn().mockReturnValue('translated') },
        },
      ],
    }).compile()

    service = module.get<TransactionService>(TransactionService)
    transactionRepository = module.get(getRepositoryToken(Transaction))
    categoryRepository = module.get(getRepositoryToken(Category))
  })

  describe('findAll', () => {
    it('should return paginated transactions', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[{ id: 'tx-1' }], 1])
      const result = await service.findAll(
        { currentPage: 1, perPage: 10 } as any,
        'user-1',
      )

      expect(result.message).toBe('Successfully returned all transactions.')
    })
  })

  describe('create', () => {
    it('should throw when expense has no category', async () => {
      await expect(
        service.create(
          { type: 'EXPENSE', amount: 100, date: '2026-01-01' } as any,
          'user-1',
        ),
      ).rejects.toThrow()
    })

    it('should throw when category not found for expense', async () => {
      categoryRepository.findOne.mockResolvedValue(null)

      await expect(
        service.create(
          {
            type: 'EXPENSE',
            amount: 100,
            date: '2026-01-01',
            categoryId: 'cat-1',
          } as any,
          'user-1',
        ),
      ).rejects.toThrow()
    })
  })
})
