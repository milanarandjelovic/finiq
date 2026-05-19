import { Test, TestingModule } from '@nestjs/testing'

import { AppController } from '@/modules/app/controllers/app.controller'
import { AppService } from '@/modules/app/services/app.service'
import { RestfulResponseDto } from '@/shared/dtos/restful-response.dto'

describe('AppController', () => {
  let controller: AppController
  let appService: jest.Mocked<AppService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getHello: jest.fn(),
            getHealth: jest.fn(),
          },
        },
      ],
    }).compile()

    controller = module.get<AppController>(AppController)
    appService = module.get<jest.Mocked<AppService>>(AppService)
  })

  describe('GET /', () => {
    it('should return app name', () => {
      appService.getHello.mockReturnValue('Finiq i18n Static')
      const result = controller.getHello()

      expect(result).toBe('Finiq i18n Static')
      expect(appService.getHello).toHaveBeenCalled()
    })
  })

  describe('GET /health', () => {
    it('should return RestfulResponseDto with health data', async () => {
      const mockHealth = {
        status: 'ok',
        timestamp: '2025-01-01T00:00:00.000Z',
        environment: 'development',
        version: '1.0.0',
      }
      appService.getHealth.mockReturnValue(mockHealth)
      const result = await controller.getHealth()

      expect(result).toBeInstanceOf(RestfulResponseDto)
      expect(result.message).toBe('Health check successful')
      expect(result.data).toEqual(mockHealth)
    })

    it('should call appService.getHealth once', async () => {
      appService.getHealth.mockReturnValue({
        status: 'ok',
        timestamp: '2025-01-01T00:00:00.000Z',
        environment: 'test',
        version: '1.0.0',
      })
      await controller.getHealth()

      expect(appService.getHealth).toHaveBeenCalledTimes(1)
    })
  })
})
