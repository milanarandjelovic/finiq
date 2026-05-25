import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

import { TransactionQueryBuilder } from '@/modules/transaction/builders/transaction-query.builder'
import { Transaction } from '@/modules/transaction/entities/transaction.entity'

describe('TransactionQueryBuilder', () => {
  let builder: TransactionQueryBuilder
  let mockQb: any

  beforeEach(async () => {
    mockQb = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      addOrderBy: jest.fn().mockReturnThis(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionQueryBuilder,
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            createQueryBuilder: jest.fn(() => mockQb),
          },
        },
      ],
    }).compile()

    builder = module.get<TransactionQueryBuilder>(TransactionQueryBuilder)
  })

  it('findAll: should build query with category join', () => {
    const qb = builder.findAll('user-1')

    expect(qb).toBeDefined()
  })

  it('findOne: should build query by id and userId', () => {
    const qb = builder.findOne('tx-1', 'user-1')

    expect(qb).toBeDefined()
  })

  describe('applyFilters', () => {
    it('should apply no filters when query is empty', () => {
      builder.applyFilters(mockQb, {} as any)

      expect(mockQb.andWhere).not.toHaveBeenCalled()
    })

    it('should apply month filter', () => {
      builder.applyFilters(mockQb, { month: 3 } as any)

      expect(mockQb.andWhere).toHaveBeenCalledWith(
        'EXTRACT(MONTH FROM transaction.date) = :month',
        { month: 3 },
      )
    })

    it('should apply year filter', () => {
      builder.applyFilters(mockQb, { year: 2026 } as any)

      expect(mockQb.andWhere).toHaveBeenCalledWith(
        'EXTRACT(YEAR FROM transaction.date) = :year',
        { year: 2026 },
      )
    })

    it('should apply type filter', () => {
      builder.applyFilters(mockQb, { type: 'INCOME' } as any)

      expect(mockQb.andWhere).toHaveBeenCalledWith('transaction.type = :type', {
        type: 'INCOME',
      })
    })

    it('should apply categoryId filter', () => {
      builder.applyFilters(mockQb, { categoryId: 'cat-1' } as any)

      expect(mockQb.andWhere).toHaveBeenCalledWith(
        'transaction.category_id = :categoryId',
        { categoryId: 'cat-1' },
      )
    })

    it('should apply categoryName filter', () => {
      builder.applyFilters(mockQb, { categoryName: 'food' } as any)

      expect(mockQb.andWhere).toHaveBeenCalledWith(
        'category.name ILIKE :categoryName',
        { categoryName: '%food%' },
      )
    })

    it('should apply multiple filters at once', () => {
      builder.applyFilters(mockQb, {
        month: 3,
        year: 2026,
        type: 'EXPENSE',
      } as any)

      expect(mockQb.andWhere).toHaveBeenCalledTimes(3)
    })
  })
})
