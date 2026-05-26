import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Setting } from '@/modules/setting/entities/setting.entity'
import { SettingService } from '@/modules/setting/services/setting.service'

describe('SettingService', () => {
  let service: SettingService
  let settingRepository: jest.Mocked<Repository<Setting>>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettingService,
        {
          provide: getRepositoryToken(Setting),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<SettingService>(SettingService)
    settingRepository = module.get(getRepositoryToken(Setting))
  })

  describe('findAll', () => {
    it('should return settings merged with defaults', async () => {
      settingRepository.find.mockResolvedValue([])
      const result = await service.findAll('user-1')

      expect(result.data.settings).toEqual({ currency: 'USD' })
    })

    it('should override defaults with user settings', async () => {
      settingRepository.find.mockResolvedValue([
        { key: 'currency', value: 'EUR' },
      ] as any)
      const result = await service.findAll('user-1')

      expect(result.data.settings.currency).toBe('EUR')
    })
  })

  describe('update', () => {
    it('should create a new setting when one does not exist', async () => {
      settingRepository.find.mockResolvedValue([])
      settingRepository.findOne.mockResolvedValue(null)
      settingRepository.create.mockReturnValue({ save: jest.fn() } as any)
      const result = await service.update({ currency: 'EUR' } as any, 'user-1')

      expect(result.message).toBe('Settings updated successfully.')
    })

    it('should update an existing setting when one already exists', async () => {
      const existing = { key: 'currency', value: 'USD' } as any
      settingRepository.find.mockResolvedValue([existing])
      settingRepository.findOne.mockResolvedValue(existing)
      settingRepository.save.mockResolvedValue(existing)
      const result = await service.update({ currency: 'EUR' } as any, 'user-1')

      expect(existing.value).toBe('EUR')
      expect(settingRepository.save).toHaveBeenCalledWith(existing)
      expect(result.message).toBe('Settings updated successfully.')
    })
  })
})
