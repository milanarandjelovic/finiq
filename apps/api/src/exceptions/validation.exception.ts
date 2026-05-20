import { BadRequestException } from '@nestjs/common'

export interface ValidationExceptionError {
  property: string
  messages: string[]
}

export class ValidationException extends BadRequestException {
  constructor(public validationErrors: ValidationExceptionError[]) {
    super()
  }
}
