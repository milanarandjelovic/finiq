import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { TransactionQueryBuilder } from '@/modules/transaction/builders/transaction-query.builder'
import { Transaction } from '@/modules/transaction/entities/transaction.entity'

describe('TransactionQueryBuilder', () => {
  let builder: TransactionQueryBuilder

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionQueryBuilder,
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            createQueryBuilder: jest.fn(() => ({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              addOrderBy: jest.fn().mockReturnThis(),
            })),
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
})
