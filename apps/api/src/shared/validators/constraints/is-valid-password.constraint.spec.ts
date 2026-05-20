import { Test, TestingModule } from '@nestjs/testing'
import { hashSync } from 'bcrypt'
import { EntityManager } from 'typeorm'

import { IsValidPasswordConstraint } from '@/shared/validators/constraints/is-valid-password.constraint'

describe('IsValidPasswordConstraint', () => {
  let constraint: IsValidPasswordConstraint
  let mockGetOne: jest.Mock

  beforeEach(async () => {
    mockGetOne = jest.fn()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IsValidPasswordConstraint,
        {
          provide: EntityManager,
          useValue: {
            getRepository: jest.fn().mockReturnValue({
              createQueryBuilder: jest.fn().mockReturnValue({
                where: jest.fn().mockReturnThis(),
                addSelect: jest.fn().mockReturnThis(),
                getOne: mockGetOne,
              }),
            }),
          },
        },
      ],
    }).compile()

    constraint = module.get<IsValidPasswordConstraint>(
      IsValidPasswordConstraint,
    )
  })

  describe('validate', () => {
    it('should return false when column is missing', async () => {
      const args = {
        constraints: [{}],
        object: { email: 'test@test.com' },
        value: 'password',
        property: 'password',
      } as any

      const result = await constraint.validate('password', args)

      expect(result).toBe(false)
    })

    it('should return false when user is not found', async () => {
      mockGetOne.mockResolvedValue(null)
      const args = {
        constraints: [{ column: 'email' }],
        object: { email: 'unknown@test.com' },
        value: 'Pass1!',
        property: 'password',
      } as any

      const result = await constraint.validate('Pass1!', args)

      expect(result).toBe(false)
    })

    it('should return false when password does not match', async () => {
      const user = { id: 'user-1', password: hashSync('correct-pass', 10) }
      mockGetOne.mockResolvedValue(user)
      const args = {
        constraints: [{ column: 'email' }],
        object: { email: 'test@test.com' },
        value: 'wrong-pass',
        property: 'password',
      } as any

      const result = await constraint.validate('wrong-pass', args)

      expect(result).toBe(false)
    })

    it('should return true when password matches', async () => {
      const plainPassword = 'correct-pass'
      const user = { id: 'user-1', password: hashSync(plainPassword, 10) }
      mockGetOne.mockResolvedValue(user)
      const args = {
        constraints: [{ column: 'email' }],
        object: { email: 'test@test.com' },
        value: plainPassword,
        property: 'password',
      } as any

      const result = await constraint.validate(plainPassword, args)

      expect(result).toBe(true)
    })
  })

  describe('defaultMessage', () => {
    it('should return invalid password message', () => {
      const message = constraint.defaultMessage()

      expect(message).toBe('Invalid password.')
    })
  })
})
