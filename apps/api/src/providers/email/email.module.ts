import path from 'path'
import {
  DynamicModule,
  FactoryProvider,
  Global,
  Module,
  ModuleMetadata,
  Provider,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createTransport } from 'nodemailer'
import hbs, { HbsTransporter } from 'nodemailer-express-handlebars'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

import { APPLICATION_NAME } from '@finiq/shared'
import { MAILER_TRANSPORT } from '@/providers/email/constants/email.constant'
import { EmailService } from '@/providers/email/services/email.service'

type ContentStackAsyncModuleOptions = {
  useFactory: (
    configService: ConfigService,
  ) =>
    | Promise<string | SMTPTransport | SMTPTransport.Options>
    | string
    | SMTPTransport
    | SMTPTransport.Options
} & Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider, 'inject'>

@Global()
@Module({})
export class EmailModule {
  static forRoot({
    useFactory,
    imports,
    inject,
  }: ContentStackAsyncModuleOptions): DynamicModule {
    const provider: Provider<HbsTransporter> = {
      provide: MAILER_TRANSPORT,
      useFactory: async (configService) => {
        const config = await useFactory(configService)
        const transport = createTransport(config)

        transport.use(
          'compile',
          hbs({
            viewEngine: {
              helpers: {
                applicationName: () => APPLICATION_NAME,
              },
              partialsDir: path.join(
                __dirname,
                '../../templates/emails/partials/',
              ),
              layoutsDir: path.join(
                __dirname,
                '../../templates/emails/layouts/',
              ),
              defaultLayout: 'main',
              extname: '.handlebars',
            },
            viewPath: path.join(__dirname, '../../templates/emails/'),
            extName: '.handlebars',
          }),
        )

        return transport
      },
      inject,
    }

    return {
      module: EmailModule,
      imports,
      providers: [provider, EmailService],
      exports: [EmailService],
    }
  }
}
