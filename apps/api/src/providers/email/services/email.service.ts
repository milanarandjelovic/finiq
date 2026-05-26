import { Inject, Injectable } from '@nestjs/common'
import type {
  HbsTransporter,
  TemplateOptions,
} from 'nodemailer-express-handlebars'
import { MailOptions } from 'nodemailer/lib/sendmail-transport'

import { MAILER_TRANSPORT } from '@/providers/email/constants/email.constant'

@Injectable()
export class EmailService {
  constructor(@Inject(MAILER_TRANSPORT) private transport: HbsTransporter) {}

  async send(config: MailOptions & TemplateOptions) {
    return await this.transport.sendMail(config)
  }
}
