import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import type { Response } from 'express'

import { LocalesController } from '@/modules/locales/controllers/locales.controller'
import { LocalesService } from '@/modules/locales/services/locales.service'

describe('LocalesController', () => {
  let controller: LocalesController
  let localesService: jest.Mocked<LocalesService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocalesController],
      providers: [
        {
          provide: LocalesService,
          useValue: {
            getAvailableLocales: jest.fn(),
            getLocale: jest.fn(),
          },
        },
      ],
    }).compile()

    controller = module.get<LocalesController>(LocalesController)
    localesService = module.get(LocalesService)
  })

  describe('GET /locales', () => {
    it('should return available locales', () => {
      localesService.getAvailableLocales.mockReturnValue(['en', 'sr'])
      const result = controller.getAvailableLocales()

      expect(result).toEqual(['en', 'sr'])
      expect(localesService.getAvailableLocales).toHaveBeenCalled()
    })

    it('should return empty array when no locales exist', () => {
      localesService.getAvailableLocales.mockReturnValue([])
      const result = controller.getAvailableLocales()

      expect(result).toEqual([])
    })
  })

  describe('GET /locales/:lang', () => {
    let mockRes: jest.Mocked<Response>

    beforeEach(() => {
      mockRes = {
        set: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as any
    })

    it('should call localesService.getLocale with the correct lang', () => {
      const translations = { key: 'value' }
      localesService.getLocale.mockReturnValue(translations)
      controller.getLocale('fr', mockRes)

      expect(localesService.getLocale).toHaveBeenCalledWith('fr')
      expect(mockRes.json).toHaveBeenCalledWith(translations)
    })

    it('should set Content-Type header to application/json', () => {
      localesService.getLocale.mockReturnValue({})
      controller.getLocale('en', mockRes)

      expect(mockRes.set).toHaveBeenCalledWith(
        'Content-Type',
        'application/json',
      )
    })

    it('should throw when service throws NotFoundException', () => {
      localesService.getLocale.mockImplementation(() => {
        throw new NotFoundException('Locale "xx" not found')
      })

      expect(() => controller.getLocale('xx', mockRes)).toThrow(
        NotFoundException,
      )
    })
  })
})
