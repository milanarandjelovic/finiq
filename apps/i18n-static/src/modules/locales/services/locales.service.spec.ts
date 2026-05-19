import * as fs from 'fs'
import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

import { LocalesService } from '@/modules/locales/services/locales.service'

jest.mock('fs')

describe('LocalesService', () => {
  let service: LocalesService

  beforeEach(async () => {
    jest.resetAllMocks()

    // Mock require.resolve to return a predictable path
    const originalResolve = require.resolve
    jest.spyOn(require, 'resolve').mockImplementation((name: string) => {
      if (name === '@finiq/translations') {
        return '/project/node_modules/@finiq/translations/dist/index.js'
      }

      return originalResolve(name)
    })

    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalesService],
    }).compile()

    service = module.get<LocalesService>(LocalesService)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('getLocale', () => {
    it('should return parsed JSON from getLocale', () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(true)
      jest.spyOn(fs, 'readFileSync').mockReturnValue('{"key":"value"}')
      const result = service.getLocale('en')

      expect(result).toEqual({ key: 'value' })
    })

    it('should throw NotFoundException when locale file does not exist', () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(false)

      expect(() => service.getLocale('xx')).toThrow(NotFoundException)
    })

    it('should include the lang code in the error message', () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(false)

      expect(() => service.getLocale('fr')).toThrow('fr')
    })

    it('should sanitize path traversal characters', () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(false)

      expect(() => service.getLocale('../../../etc/passwd')).toThrow(
        NotFoundException,
      )
    })

    it('should sanitize mixed path traversal', () => {
      jest.spyOn(fs, 'existsSync').mockImplementation((path: fs.PathLike) => {
        if (path.toString().endsWith('enetcpasswd.json')) {
          return false
        }

        return false
      })

      expect(() => service.getLocale('en/../../../etc/passwd')).toThrow(
        NotFoundException,
      )
    })

    it('should allow valid language codes with hyphens', () => {
      jest.spyOn(fs, 'existsSync').mockImplementation((path: fs.PathLike) => {
        if (path.toString().endsWith('de-DE.json')) {
          return true
        }

        return false
      })
      jest.spyOn(fs, 'readFileSync').mockReturnValue('{"valid":true}')
      const result = service.getLocale('de-DE')

      expect(result).toEqual({ valid: true })
    })

    it('should allow valid language codes with underscores', () => {
      jest.spyOn(fs, 'existsSync').mockImplementation((path: fs.PathLike) => {
        if (path.toString().endsWith('zh_CN.json')) {
          return true
        }

        return false
      })
      jest.spyOn(fs, 'readFileSync').mockReturnValue('{"valid":true}')
      const result = service.getLocale('zh_CN')

      expect(result).toEqual({ valid: true })
    })

    it('should propagate JSON parse errors', () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(true)
      jest.spyOn(fs, 'readFileSync').mockReturnValue('not valid json')

      expect(() => service.getLocale('en')).toThrow(SyntaxError)
    })
  })

  describe('getAvailableLocales', () => {
    it('should return locale codes from .json files', () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(true)
      jest
        .spyOn(fs, 'readdirSync')
        .mockReturnValue(['en.json', 'sr.json'] as any)
      const result = service.getAvailableLocales()

      expect(result).toEqual(['en', 'sr'])
    })

    it('should return empty array when directory does not exist', () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(false)
      const result = service.getAvailableLocales()

      expect(result).toEqual([])
    })

    it('should filter out non-JSON files', () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(true)
      jest
        .spyOn(fs, 'readdirSync')
        .mockReturnValue([
          'en.json',
          'sr.json',
          '.DS_Store',
          'notes.txt',
        ] as any)
      const result = service.getAvailableLocales()

      expect(result).toEqual(['en', 'sr'])
    })
  })
})
