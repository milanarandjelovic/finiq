import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'

import { AppService } from '@/modules/app/services/app.service'

describe('AppService', () => {
  let service: AppService
  let configService: jest.Mocked<ConfigService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: ConfigService,
          useValue: { get: jest.fn() },
        },
      ],
    }).compile()

    service = module.get<AppService>(AppService)
    configService = module.get<jest.Mocked<ConfigService>>(ConfigService)
  })

  describe('getHello', () => {
    it('should return the app name', () => {
      expect(service.getHello()).toBe('Finiq API')
    })
  })

  describe('getHealth', () => {
    it('should return status "ok"', () => {
      configService.get.mockReturnValue(undefined)
      const health = service.getHealth()

      expect(health.status).toBe('ok')
    })

    it('should include environment from ConfigService', () => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'NODE_ENV') {
          return 'production'
        }

        return undefined
      })
      const health = service.getHealth()

      expect(health.environment).toBe('production')
    })

    it('should include version from ConfigService', () => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'appVersion') {
          return '2.0.0'
        }

        return undefined
      })
      const health = service.getHealth()

      expect(health.version).toBe('2.0.0')
    })

    it('should include an ISO timestamp', () => {
      const health = service.getHealth()

      expect(health.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
    })

    it('should fall back to "development" when NODE_ENV is not set', () => {
      configService.get.mockReturnValue(undefined)
      const health = service.getHealth()

      expect(health.environment).toBe('development')
    })

    it('should fall back to "1.0.0" when appVersion is not set', () => {
      configService.get.mockReturnValue(undefined)
      const health = service.getHealth()

      expect(health.version).toBe('1.0.0')
    })
  })
})
