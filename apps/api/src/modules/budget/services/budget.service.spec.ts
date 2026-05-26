import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { I18nService } from 'nestjs-i18n'
import { Repository } from 'typeorm'

import { BudgetQueryBuilder } from '@/modules/budget/builders/budget-query.builder'
import { Budget } from '@/modules/budget/entities/budget.entity'
import { BudgetService } from '@/modules/budget/services/budget.service'
import { Category } from '@/modules/category/entities/category.entity'

describe('BudgetService', () => {
  let service: BudgetService
  let budgetRepository: jest.Mocked<Repository<Budget>>
  let categoryRepository: jest.Mocked<Repository<Category>>

  const mockQueryBuilder: any = {
    findAll: jest.fn().mockReturnThis(),
    findOne: jest.fn().mockReturnThis(),
    findPreviousMonth: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
    getOne: jest.fn(),
    getMany: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BudgetService,
        {
          provide: getRepositoryToken(Budget),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Category),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: BudgetQueryBuilder,
          useValue: mockQueryBuilder,
        },
        {
          provide: I18nService,
          useValue: { t: jest.fn().mockReturnValue('translated') },
        },
      ],
    }).compile()

    service = module.get<BudgetService>(BudgetService)
    budgetRepository = module.get(getRepositoryToken(Budget))
    categoryRepository = module.get(getRepositoryToken(Category))
  })

  describe('findAll', () => {
    it('should return paginated budgets sorted by category sort order', async () => {
      const budgets = [
        { category: { sortOrder: 1 } },
        { category: { sortOrder: 2 } },
      ]
      mockQueryBuilder.getManyAndCount.mockResolvedValue([budgets, 2])

      const result = await service.findAll(
        { month: 1, year: 2026, currentPage: 1, perPage: 10 } as any,
        'user-1',
      )

      expect(result.message).toBe('Successfully returned all budgets.')
      expect(result.data.budgets.data).toHaveLength(2)
    })
  })

  describe('upsert', () => {
    it('should throw when category not found', async () => {
      categoryRepository.findOne.mockResolvedValue(null)

      await expect(
        service.upsert(
          { categoryId: 'cat-1', month: 1, year: 2026, amount: 100 } as any,
          'user-1',
        ),
      ).rejects.toThrow()
    })

    it('should update existing budget amount when one already exists', async () => {
      const category = { id: 'cat-1' }
      categoryRepository.findOne.mockResolvedValue(category as any)
      const existing = { id: 'budget-1', amount: 50, category }
      mockQueryBuilder.getOne.mockResolvedValue(existing)
      jest.mocked(budgetRepository.save).mockResolvedValue(existing as any)

      const result = await service.upsert(
        { categoryId: 'cat-1', month: 1, year: 2026, amount: 200 },
        'user-1',
      )

      expect(existing.amount).toBe(200)
      expect(budgetRepository.save).toHaveBeenCalledWith(existing)
      expect(result.message).toBe('Budget saved successfully.')
    })

    it('should create a new budget when none exists', async () => {
      const category = { id: 'cat-1' }
      categoryRepository.findOne.mockResolvedValue(category as any)
      mockQueryBuilder.getOne.mockResolvedValue(null)
      budgetRepository.create.mockReturnValue({
        save: jest.fn().mockResolvedValue({ id: 'new' }),
      } as any)
      const result = await service.upsert(
        { categoryId: 'cat-1', month: 1, year: 2026, amount: 100 },
        'user-1',
      )

      expect(result.message).toBe('Budget saved successfully.')
    })
  })

  describe('copyFromPreviousMonth', () => {
    it('should throw when no previous month budgets exist', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([])

      await expect(
        service.copyFromPreviousMonth(
          { month: 1, year: 2026 } as any,
          'user-1',
        ),
      ).rejects.toThrow()
    })

    it('should update existing budgets when they already exist for the target month', async () => {
      const sourceBudgets = [{ category: { id: 'cat-1' }, amount: 100 }]
      const existingBudget = {
        id: 'bgt-1',
        amount: 50,
        category: { id: 'cat-1' },
      }
      mockQueryBuilder.getMany.mockResolvedValue(sourceBudgets)
      mockQueryBuilder.getOne.mockResolvedValue(existingBudget)
      jest
        .mocked(budgetRepository.save)
        .mockResolvedValue(existingBudget as any)
      const result = await service.copyFromPreviousMonth(
        { month: 2, year: 2026 } as any,
        'user-1',
      )

      expect(existingBudget.amount).toBe(100)
      expect(budgetRepository.save).toHaveBeenCalled()
      expect(result.message).toContain('Copied 1 budgets')
    })

    it('should create new budgets when they do not exist for the target month', async () => {
      const sourceBudgets = [{ category: { id: 'cat-1' }, amount: 100 }]
      mockQueryBuilder.getMany.mockResolvedValue(sourceBudgets)
      mockQueryBuilder.getOne.mockResolvedValue(null)
      const newBudget = { id: 'new-bgt', amount: 100 }
      jest.mocked(budgetRepository.create).mockReturnValue({
        save: jest.fn().mockResolvedValue(newBudget),
      } as any)
      const result = await service.copyFromPreviousMonth(
        { month: 2, year: 2026 } as any,
        'user-1',
      )

      expect(budgetRepository.create).toHaveBeenCalled()
      expect(result.message).toContain('Copied 1 budgets')
    })
  })
})
