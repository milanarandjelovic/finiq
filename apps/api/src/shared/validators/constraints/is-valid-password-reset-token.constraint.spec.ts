import { Test, TestingModule } from '@nestjs/testing'
import { EntityManager } from 'typeorm'

import { IsValidPasswordResetTokenConstraint } from '@/shared/validators/constraints/is-valid-password-reset-token.constraint'

describe('IsValidPasswordResetTokenConstraint', () => {
  let constraint: IsValidPasswordResetTokenConstraint
  let mockEntityManager: {
    getRepository: jest.Mock
  }

  beforeEach(async () => {
    mockEntityManager = {
      getRepository: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IsValidPasswordResetTokenConstraint,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile()

    constraint = module.get<IsValidPasswordResetTokenConstraint>(
      IsValidPasswordResetTokenConstraint,
    )
  })

  describe('validate', () => {
    it('should return false when column is missing', async () => {
      const args = {
        constraints: [{}],
        object: { email: 'test@test.com' },
        property: 'token',
      } as any

      const result = await constraint.validate('some-token', args)

      expect(result).toBe(false)
    })

    it('should return false when user is not found', async () => {
      mockEntityManager.getRepository.mockReturnValue({
        createQueryBuilder: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValue(null),
        }),
      })
      const args = {
        constraints: [{ column: 'email' }],
        object: { email: 'unknown@test.com' },
        property: 'token',
      } as any

      const result = await constraint.validate('some-token', args)

      expect(result).toBe(false)
    })

    it('should return false when password reset record is not found', async () => {
      const user = { id: 'user-1', email: 'test@test.com' }
      let callCount = 0
      mockEntityManager.getRepository.mockImplementation(() => ({
        createQueryBuilder: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockImplementation(() => {
            callCount++
            return callCount === 1
              ? Promise.resolve(user)
              : Promise.resolve(null)
          }),
        }),
      }))

      const args = {
        constraints: [{ column: 'email' }],
        object: { email: 'test@test.com' },
        property: 'token',
      } as any

      const result = await constraint.validate('invalid-token', args)

      expect(result).toBe(false)
    })

    it('should return true when both user and reset record are found', async () => {
      const user = { id: 'user-1', email: 'test@test.com' }
      const resetRecord = { token: 'valid-token', user }
      let callCount = 0
      mockEntityManager.getRepository.mockImplementation(() => ({
        createQueryBuilder: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockImplementation(() => {
            callCount++
            return callCount === 1
              ? Promise.resolve(user)
              : Promise.resolve(resetRecord)
          }),
        }),
      }))

      const args = {
        constraints: [{ column: 'email' }],
        object: { email: 'test@test.com' },
        property: 'token',
      } as any

      const result = await constraint.validate('valid-token', args)

      expect(result).toBe(true)
    })
  })

  describe('defaultMessage', () => {
    it('should return invalid token message', () => {
      const message = constraint.defaultMessage()

      expect(message).toBe('Token is not valid.')
    })
  })
})
