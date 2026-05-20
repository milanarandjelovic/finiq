import { Test, TestingModule } from '@nestjs/testing'

import { SettingController } from '@/modules/setting/controllers/setting.controller'
import { SettingService } from '@/modules/setting/services/setting.service'

describe('SettingController', () => {
  let controller: SettingController
  let settingService: jest.Mocked<SettingService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SettingController],
      providers: [
        {
          provide: SettingService,
          useValue: {
            findAll: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile()

    controller = module.get<SettingController>(SettingController)
    settingService = module.get(SettingService)
  })

  it('GET /settings: should call settingService.findAll', async () => {
    const req = { user: { id: 'user-1' } } as any
    await controller.findAll(req)

    expect(settingService.findAll).toHaveBeenCalledWith('user-1')
  })

  it('PUT /settings: should call settingService.update', async () => {
    const body = { currency: 'EUR' } as any
    const req = { user: { id: 'user-1' } } as any
    await controller.update(body, req)

    expect(settingService.update).toHaveBeenCalledWith(body, 'user-1')
  })
})
