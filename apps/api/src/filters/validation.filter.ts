import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import { I18nContext, I18nService } from 'nestjs-i18n'

import { ValidationException } from '@/exceptions/validation.exception'

@Injectable()
@Catch(ValidationException)
export class ValidationFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}

  catch(exception: ValidationException, host: ArgumentsHost): any {
    const context = host.switchToHttp()
    const response = context.getResponse()
    const lang = I18nContext.current()?.lang

    return response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Validation Exception',
      errors: exception.validationErrors.map((error) => ({
        property: error.property,
        messages: error.messages.map((message) =>
          this.translate(message, lang),
        ),
      })),
    })
  }

  private translate(message: string, lang?: string): string {
    if (!message.includes('|')) {
      return this.i18n.translate(message, { lang })
    }

    const [key, argsString] = message.split('|')

    try {
      return this.i18n.translate(key, { lang, args: JSON.parse(argsString) })
    } catch {
      return this.i18n.translate(key, { lang })
    }
  }
}
