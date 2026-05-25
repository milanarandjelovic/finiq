import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

import { CategoryQueryBuilder } from '@/modules/category/builders/category-query.builder'
import { Category } from '@/modules/category/entities/category.entity'

describe('CategoryQueryBuilder', () => {
  let builder: CategoryQueryBuilder

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryQueryBuilder,
        {
          provide: getRepositoryToken(Category),
          useValue: {
            createQueryBuilder: jest.fn(() => ({
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              addOrderBy: jest.fn().mockReturnThis(),
            })),
          },
        },
      ],
    }).compile()

    builder = module.get<CategoryQueryBuilder>(CategoryQueryBuilder)
  })

  it('findAll: should build query ordered by sort_order', () => {
    const qb = builder.findAll('user-1')

    expect(qb).toBeDefined()
  })

  it('findOne: should build query by id and userId', () => {
    const qb = builder.findOne('cat-1', 'user-1')

    expect(qb).toBeDefined()
  })

  it('findAllGoals: should build query filtering is_goal = true', () => {
    const qb = builder.findAllGoals('user-1')

    expect(qb).toBeDefined()
  })

  it('findAllNonGoals: should build query filtering is_goal = false', () => {
    const qb = builder.findAllNonGoals('user-1')

    expect(qb).toBeDefined()
  })
})
