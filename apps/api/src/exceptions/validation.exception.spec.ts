import { BadRequestException } from '@nestjs/common'

import { ValidationException } from '@/exceptions/validation.exception'

describe('ValidationException', () => {
  it('should extend BadRequestException', () => {
    const errors = [{ property: 'email', messages: ['is required'] }]
    const exception = new ValidationException(errors)

    expect(exception).toBeInstanceOf(ValidationException)
    expect(exception).toBeInstanceOf(BadRequestException)
  })

  it('should carry validation errors', () => {
    const errors = [{ property: 'email', messages: ['api.authUserNotFound'] }]
    const exception = new ValidationException(errors)

    expect(exception.validationErrors).toEqual(errors)
  })

  it('should support multiple errors', () => {
    const errors = [
      { property: 'email', messages: ['api.authUserNotFound'] },
      { property: 'password', messages: ['api.authInvalidPassword'] },
    ]
    const exception = new ValidationException(errors)

    expect(exception.validationErrors).toHaveLength(2)
  })
})
