import { Test, TestingModule } from '@nestjs/testing'

import { IsMatchConstraint } from '@/shared/validators/constraints/is-match.constraint'

describe('IsMatchConstraint', () => {
  let constraint: IsMatchConstraint

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IsMatchConstraint],
    }).compile()

    constraint = module.get<IsMatchConstraint>(IsMatchConstraint)
  })

  describe('validate', () => {
    it('should return false when field is missing from constraints', async () => {
      const args = {
        constraints: [{}],
        object: { confirmPassword: 'Pass1!' },
        property: 'confirmPassword',
      } as any

      const result = await constraint.validate('Pass1!', args)

      expect(result).toBe(false)
    })

    it('should return true when value matches the referenced field', async () => {
      const args = {
        constraints: [{ field: 'password' }],
        object: { password: 'Pass1!', confirmPassword: 'Pass1!' },
        property: 'confirmPassword',
      } as any

      const result = await constraint.validate('Pass1!', args)

      expect(result).toBe(true)
    })

    it('should return false when value does not match the referenced field', async () => {
      const args = {
        constraints: [{ field: 'password' }],
        object: { password: 'Pass1!', confirmPassword: 'Different1!' },
        property: 'confirmPassword',
      } as any

      const result = await constraint.validate('Different1!', args)

      expect(result).toBe(false)
    })
  })

  describe('defaultMessage', () => {
    it('should return mismatch message with property and field names', () => {
      const args = {
        constraints: [{ field: 'password' }],
        property: 'confirmPassword',
      } as any

      const message = constraint.defaultMessage(args)

      expect(message).toBe('confirmPassword and password does not match.')
    })
  })
})
