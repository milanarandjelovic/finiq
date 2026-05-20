import { Test, TestingModule } from '@nestjs/testing'

import { MAILER_TRANSPORT } from '@/providers/email/constants/email.constant'
import { EmailService } from '@/providers/email/services/email.service'

describe('EmailService', () => {
  let service: EmailService
  let transport: jest.Mocked<{ sendMail: jest.Mock }>

  beforeEach(async () => {
    transport = { sendMail: jest.fn() }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        { provide: MAILER_TRANSPORT, useValue: transport },
      ],
    }).compile()

    service = module.get<EmailService>(EmailService)
  })

  it('send: should call transport.sendMail with config', async () => {
    const config = { to: 'test@test.com', subject: 'Test', template: 'test' }
    await service.send(config as any)

    expect(transport.sendMail).toHaveBeenCalledWith(config)
  })
})
