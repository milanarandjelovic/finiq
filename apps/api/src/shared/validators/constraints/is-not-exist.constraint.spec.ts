import { Test, TestingModule } from '@nestjs/testing'
import { EntityManager } from 'typeorm'

import { IsNotExistConstraint } from '@/shared/validators/constraints/is-not-exist.constraint'

describe('IsNotExistConstraint', () => {
  let constraint: IsNotExistConstraint
  let mockGetExists: jest.Mock

  beforeEach(async () => {
    mockGetExists = jest.fn()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IsNotExistConstraint,
        {
          provide: EntityManager,
          useValue: {
            getRepository: jest.fn().mockReturnValue({
              createQueryBuilder: jest.fn().mockReturnValue({
                where: jest.fn().mockReturnThis(),
                getExists: mockGetExists,
              }),
            }),
          },
        },
      ],
    }).compile()

    constraint = module.get<IsNotExistConstraint>(IsNotExistConstraint)
  })

  describe('validate', () => {
    it('should return false when tableName is missing', async () => {
      const args = {
        constraints: [{ column: 'email' }],
        property: 'email',
      } as any

      const result = await constraint.validate('test@test.com', args)

      expect(result).toBe(false)
    })

    it('should return false when column is missing', async () => {
      const args = {
        constraints: [{ tableName: 'users' }],
        property: 'email',
      } as any

      const result = await constraint.validate('test@test.com', args)

      expect(result).toBe(false)
    })

    it('should return true when value exists in DB', async () => {
      mockGetExists.mockResolvedValue(true)
      const args = {
        constraints: [{ tableName: 'users', column: 'email' }],
        property: 'email',
      } as any

      const result = await constraint.validate('existing@test.com', args)

      expect(result).toBe(true)
    })

    it('should return false when value does not exist in DB', async () => {
      mockGetExists.mockResolvedValue(false)
      const args = {
        constraints: [{ tableName: 'users', column: 'email' }],
        property: 'email',
      } as any

      const result = await constraint.validate('missing@test.com', args)

      expect(result).toBe(false)
    })
  })

  describe('defaultMessage', () => {
    it('should return not exists message with property name', () => {
      const args = { property: 'email' } as any

      const message = constraint.defaultMessage(args)

      expect(message).toBe('email entered is not exists.')
    })
  })
})
