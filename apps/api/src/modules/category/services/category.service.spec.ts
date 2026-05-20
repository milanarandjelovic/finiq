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
    it('should return paginated categories', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[{ id: 'cat-1' }], 1])
      const result = await service.findAll(
        { currentPage: 1, perPage: 10 } as any,
        'user-1',
      )

      expect(result.message).toBe('Successfully returned all categories.')
    })
  })

  describe('findOne', () => {
    it('should throw when category not found', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null)

      await expect(service.findOne('cat-1', 'user-1')).rejects.toThrow()
    })
  })

  describe('create', () => {
    it('should create a category with defaults', async () => {
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
  })

  describe('delete', () => {
    it('should throw when category not found', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null)

      await expect(service.delete('cat-1', 'user-1')).rejects.toThrow()
    })
  })
})
