import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { I18nService } from 'nestjs-i18n'
import { Repository } from 'typeorm'

import { CategoryQueryBuilder } from '@/modules/category/builders/category-query.builder'
import { Category } from '@/modules/category/entities/category.entity'
import { CategoryService } from '@/modules/category/services/category.service'

describe('CategoryService', () => {
  let service: CategoryService
  let categoryRepository: jest.Mocked<Repository<Category>>

  const mockQueryBuilder: any = {
    findAll: jest.fn().mockReturnThis(),
    findOne: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
    getOne: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(Category),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: CategoryQueryBuilder,
          useValue: mockQueryBuilder,
        },
        {
          provide: I18nService,
          useValue: { t: jest.fn().mockReturnValue('translated') },
        },
      ],
    }).compile()

    service = module.get<CategoryService>(CategoryService)
    categoryRepository = module.get(getRepositoryToken(Category))
  })

  describe('findAll', () => {
    it('should return paginated categories without filters', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[{ id: 'cat-1' }], 1])
      const result = await service.findAll(
        { currentPage: 1, perPage: 10 } as any,
        'user-1',
      )

      expect(result.message).toBe('Successfully returned all categories.')
    })

    it('should apply isGoal=1 filter', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[], 0])
      await service.findAll(
        { currentPage: 1, perPage: 10, isGoal: 1 } as any,
        'user-1',
      )

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'category.is_goal = true',
      )
    })

    it('should apply isGoal=0 filter', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[], 0])
      await service.findAll(
        { currentPage: 1, perPage: 10, isGoal: 0 } as any,
        'user-1',
      )

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'category.is_goal = false',
      )
    })

    it('should apply name filter', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[], 0])
      await service.findAll(
        { currentPage: 1, perPage: 10, name: 'food' } as any,
        'user-1',
      )

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'LOWER(category.name) LIKE LOWER(:name)',
        { name: '%food%' },
      )
    })
  })

  describe('findOne', () => {
    it('should throw when category not found', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null)

      await expect(service.findOne('cat-1', 'user-1')).rejects.toThrow()
    })

    it('should return category when found', async () => {
      const category = { id: 'cat-1', name: 'Food' }
      mockQueryBuilder.getOne.mockResolvedValue(category)
      const result = await service.findOne('cat-1', 'user-1')

      expect(result.message).toBe('Successfully returned category.')
      expect(result.data.category).toEqual(category)
    })
  })

  describe('create', () => {
    it('should create a category with all optional fields', async () => {
      const savedCategory = {
        id: 'new-cat',
        name: 'Savings',
        emoji: '💰',
        isGoal: true,
      }
      categoryRepository.create.mockReturnValue({
        save: jest.fn().mockResolvedValue(savedCategory),
      } as any)
      const result = await service.create(
        {
          name: 'Savings',
          emoji: '💰',
          color: '#fff',
          budgetAmount: 500,
          isGoal: true,
          targetAmount: 10000,
          targetDate: '2027-01-01',
          sortOrder: 1,
        } as any,
        'user-1',
      )

      expect(result.message).toBe('Category created successfully.')
    })

    it('should create a category with defaults for optional fields', async () => {
      const savedCategory = { id: 'new-cat', name: 'Test', emoji: '💰' }
      categoryRepository.create.mockReturnValue({
        save: jest.fn().mockResolvedValue(savedCategory),
      } as any)
      const result = await service.create(
        { name: 'Test', emoji: '💰' } as any,
        'user-1',
      )

      expect(result.message).toBe('Category created successfully.')
    })
  })

  describe('update', () => {
    it('should throw when category not found', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null)

      await expect(
        service.update('cat-1', { name: 'New' } as any, 'user-1'),
      ).rejects.toThrow()
    })

    it('should update all provided fields', async () => {
      const category: any = {
        id: 'cat-1',
        name: 'Old',
        emoji: '🍎',
        color: '#red',
        budgetAmount: 100,
        isGoal: false,
        targetAmount: 0,
        targetDate: null,
        sortOrder: 0,
      }
      mockQueryBuilder.getOne.mockResolvedValue(category)
      jest.mocked(categoryRepository.save).mockResolvedValue(category)
      const result = await service.update(
        'cat-1',
        {
          name: 'New',
          emoji: '🎯',
          color: '#blue',
          budgetAmount: 200,
          isGoal: true,
          targetAmount: 5000,
          targetDate: '2027-06-01',
          sortOrder: 2,
        } as any,
        'user-1',
      )

      expect(result.message).toBe('Category updated successfully.')
      expect(category.name).toBe('New')
      expect(category.emoji).toBe('🎯')
      expect(category.budgetAmount).toBe(200)
      expect(category.isGoal).toBe(true)
      expect(category.targetAmount).toBe(5000)
      expect(category.sortOrder).toBe(2)
    })

    it('should set targetDate to null when targetDate is explicitly null', async () => {
      const category: any = { id: 'cat-1', targetDate: new Date() }
      mockQueryBuilder.getOne.mockResolvedValue(category)
      jest.mocked(categoryRepository.save).mockResolvedValue(category)
      await service.update('cat-1', { targetDate: null } as any, 'user-1')

      expect(category.targetDate).toBeNull()
    })

    it('should not update fields when they are undefined', async () => {
      const category: any = {
        id: 'cat-1',
        name: 'Unchanged',
        budgetAmount: 100,
      }
      mockQueryBuilder.getOne.mockResolvedValue(category)
      jest.mocked(categoryRepository.save).mockResolvedValue(category)
      await service.update('cat-1', {} as any, 'user-1')

      expect(category.name).toBe('Unchanged')
    })
  })

  describe('delete', () => {
    it('should throw when category not found', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null)

      await expect(service.delete('cat-1', 'user-1')).rejects.toThrow()
    })

    it('should delete and return category', async () => {
      const category = { id: 'cat-1', name: 'Food' }
      mockQueryBuilder.getOne.mockResolvedValue(category)
      jest.mocked(categoryRepository.remove).mockResolvedValue(category as any)
      const result = await service.delete('cat-1', 'user-1')

      expect(result.message).toBe('Category deleted successfully.')
      expect(result.data.category).toEqual(category)
    })
  })
})
