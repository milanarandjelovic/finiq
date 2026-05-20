import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

import { BudgetQueryBuilder } from '@/modules/budget/builders/budget-query.builder'
import { Budget } from '@/modules/budget/entities/budget.entity'

describe('BudgetQueryBuilder', () => {
  let builder: BudgetQueryBuilder

  const mockQueryBuilder: any = {
    innerJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BudgetQueryBuilder,
        {
          provide: getRepositoryToken(Budget),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
          },
        },
      ],
    }).compile()

    builder = module.get<BudgetQueryBuilder>(BudgetQueryBuilder)

    jest.clearAllMocks()
    mockQueryBuilder.innerJoinAndSelect.mockReturnThis()
    mockQueryBuilder.where.mockReturnThis()
    mockQueryBuilder.andWhere.mockReturnThis()
  })

  describe('findAll', () => {
    it('should query without categoryName filter when not provided', () => {
      builder.findAll('user-1', 3, 2024)

      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalledWith(
        expect.stringContaining('categoryName'),
        expect.anything(),
      )
    })

    it('should apply categoryName filter when provided', () => {
      builder.findAll('user-1', 3, 2024, 'food')

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'category.name ILIKE :categoryName',
        { categoryName: '%food%' },
      )
    })

    it('should return the query builder', () => {
      const result = builder.findAll('user-1', 3, 2024)

      expect(result).toBe(mockQueryBuilder)
    })
  })

  describe('findPreviousMonth', () => {
    it('should return December of previous year when month is January', () => {
      builder.findPreviousMonth('user-1', 1, 2024)

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'budget.month = :month',
        { month: 12 },
      )
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'budget.year = :year',
        { year: 2023 },
      )
    })

    it('should return the previous month within the same year', () => {
      builder.findPreviousMonth('user-1', 6, 2024)

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'budget.month = :month',
        { month: 5 },
      )
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'budget.year = :year',
        { year: 2024 },
      )
    })

    it('should return the query builder', () => {
      const result = builder.findPreviousMonth('user-1', 6, 2024)

      expect(result).toBe(mockQueryBuilder)
    })
  })
})
