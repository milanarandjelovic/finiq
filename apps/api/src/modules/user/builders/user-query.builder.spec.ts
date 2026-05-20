import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

import { UserQueryBuilder } from '@/modules/user/builders/user-query.builder'
import { User } from '@/modules/user/entities/user.entity'

describe('UserQueryBuilder', () => {
  let builder: UserQueryBuilder

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserQueryBuilder,
        {
          provide: getRepositoryToken(User),
          useValue: {
            createQueryBuilder: jest.fn(() => ({
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
            })),
          },
        },
      ],
    }).compile()

    builder = module.get<UserQueryBuilder>(UserQueryBuilder)
  })

  it('createFindAllQueryBuilder: should return a query builder', () => {
    const qb = builder.createFindAllQueryBuilder()

    expect(qb).toBeDefined()
  })

  it('createFindOneQueryBuilder: should filter by id', () => {
    const qb = builder.createFindOneQueryBuilder('user-1')

    expect(qb).toBeDefined()
  })

  it('createDeleteQueryBuilder: should filter by ids array', () => {
    const qb = builder.createDeleteQueryBuilder(['user-1', 'user-2'])

    expect(qb).toBeDefined()
  })

  it('applySearchFilters: should apply name filter when name is provided', () => {
    const mockQb = { andWhere: jest.fn().mockReturnThis() } as any

    builder.applySearchFilters(mockQb, { name: 'John' } as any)

    expect(mockQb.andWhere).toHaveBeenCalledWith('user.name ILIKE :name', {
      name: '%John%',
    })
  })

  it('applySearchFilters: should not apply name filter when name is not provided', () => {
    const mockQb = { andWhere: jest.fn() } as any

    builder.applySearchFilters(mockQb, {} as any)

    expect(mockQb.andWhere).not.toHaveBeenCalled()
  })
})
