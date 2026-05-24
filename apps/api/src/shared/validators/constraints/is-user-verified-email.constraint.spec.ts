import { Test, TestingModule } from '@nestjs/testing'
import { EntityManager } from 'typeorm'

import { IsUserVerifiedEmailConstraint } from '@/shared/validators/constraints/is-user-verified-email.constraint'

describe('IsUserVerifiedEmailConstraint', () => {
  let constraint: IsUserVerifiedEmailConstraint
  let mockGetOne: jest.Mock

  beforeEach(async () => {
    mockGetOne = jest.fn()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IsUserVerifiedEmailConstraint,
        {
          provide: EntityManager,
          useValue: {
            getRepository: jest.fn().mockReturnValue({
              createQueryBuilder: jest.fn().mockReturnValue({
                where: jest.fn().mockReturnThis(),
                getOne: mockGetOne,
              }),
            }),
          },
        },
      ],
    }).compile()

    constraint = module.get<IsUserVerifiedEmailConstraint>(
      IsUserVerifiedEmailConstraint,
    )
  })

  describe('validate', () => {
    it('should return false when column is missing', async () => {
      const args = {
        constraints: [{}],
        property: 'email',
      } as any

      const result = await constraint.validate('test@test.com', args)

      expect(result).toBe(false)
    })

    it('should return false when user has activatedAt set (already verified)', async () => {
      mockGetOne.mockResolvedValue({
        email: 'test@test.com',
        activatedAt: new Date(),
      })
      const args = {
        constraints: [{ column: 'email' }],
        property: 'email',
      } as any

      const result = await constraint.validate('test@test.com', args)

      expect(result).toBe(false)
    })

    it('should return true when user has no activatedAt (not yet verified)', async () => {
      mockGetOne.mockResolvedValue({
        email: 'test@test.com',
        activatedAt: null,
      })
      const args = {
        constraints: [{ column: 'email' }],
        property: 'email',
      } as any

      const result = await constraint.validate('test@test.com', args)

      expect(result).toBe(true)
    })

    it('should return true when user is not found', async () => {
      mockGetOne.mockResolvedValue(null)
      const args = {
        constraints: [{ column: 'email' }],
        property: 'email',
      } as any

      const result = await constraint.validate('unknown@test.com', args)

      expect(result).toBe(true)
    })
  })

  describe('defaultMessage', () => {
    it('should return already verified message', () => {
      const message = constraint.defaultMessage()

      expect(message).toBe('Email is already verified.')
    })
  })
})
