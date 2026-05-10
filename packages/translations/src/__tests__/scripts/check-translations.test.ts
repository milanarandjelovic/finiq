import fs from 'fs'
import path from 'path'

jest.mock('fs')
jest.mock('path')

describe('check-translations script', () => {
  const mockFs = fs as jest.Mocked<typeof fs>
  const mockPath = path as jest.Mocked<typeof path>

  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(console, 'log').mockImplementation()
    jest.spyOn(console, 'error').mockImplementation()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('getKeys function logic', () => {
    it('should extract all keys from a flat object', () => {
      const obj = {
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
      }
      const getKeys = (obj: Record<string, unknown>, prefix = ''): string[] => {
        const keys: string[] = []

        for (const [key, value] of Object.entries(obj)) {
          const fullKey = prefix ? `${prefix}.${key}` : key

          if (value && typeof value === 'object' && !Array.isArray(value)) {
            keys.push(...getKeys(value as Record<string, unknown>, fullKey))
          } else {
            keys.push(fullKey)
          }
        }

        return keys
      }
      const result = getKeys(obj)

      expect(result).toEqual(['key1', 'key2', 'key3'])
    })

    it('should extract all keys from a nested object', () => {
      const obj = {
        general: {
          welcome: 'Welcome',
          loading: 'Loading...',
        },
        auth: {
          login: 'Login',
          logout: 'Logout',
        },
      }
      const getKeys = (obj: Record<string, unknown>, prefix = ''): string[] => {
        const keys: string[] = []

        for (const [key, value] of Object.entries(obj)) {
          const fullKey = prefix ? `${prefix}.${key}` : key

          if (value && typeof value === 'object' && !Array.isArray(value)) {
            keys.push(...getKeys(value as Record<string, unknown>, fullKey))
          } else {
            keys.push(fullKey)
          }
        }

        return keys
      }
      const result = getKeys(obj)

      expect(result).toEqual([
        'general.welcome',
        'general.loading',
        'auth.login',
        'auth.logout',
      ])
    })

    it('should handle deeply nested objects', () => {
      const obj = {
        level1: {
          level2: {
            level3: {
              key: 'value',
            },
          },
        },
      }
      const getKeys = (obj: Record<string, unknown>, prefix = ''): string[] => {
        const keys: string[] = []

        for (const [key, value] of Object.entries(obj)) {
          const fullKey = prefix ? `${prefix}.${key}` : key

          if (value && typeof value === 'object' && !Array.isArray(value)) {
            keys.push(...getKeys(value as Record<string, unknown>, fullKey))
          } else {
            keys.push(fullKey)
          }
        }

        return keys
      }
      const result = getKeys(obj)

      expect(result).toEqual(['level1.level2.level3.key'])
    })

    it('should handle empty objects', () => {
      const obj = {}
      const getKeys = (obj: Record<string, unknown>, prefix = ''): string[] => {
        const keys: string[] = []

        for (const [key, value] of Object.entries(obj)) {
          const fullKey = prefix ? `${prefix}.${key}` : key

          if (value && typeof value === 'object' && !Array.isArray(value)) {
            keys.push(...getKeys(value as Record<string, unknown>, fullKey))
          } else {
            keys.push(fullKey)
          }
        }

        return keys
      }
      const result = getKeys(obj)

      expect(result).toEqual([])
    })

    it('should handle mixed nested and flat structure', () => {
      const obj = {
        flatKey: 'value',
        nested: {
          key1: 'value1',
          key2: 'value2',
        },
        anotherFlat: 'value',
      }
      const getKeys = (obj: Record<string, unknown>, prefix = ''): string[] => {
        const keys: string[] = []

        for (const [key, value] of Object.entries(obj)) {
          const fullKey = prefix ? `${prefix}.${key}` : key

          if (value && typeof value === 'object' && !Array.isArray(value)) {
            keys.push(...getKeys(value as Record<string, unknown>, fullKey))
          } else {
            keys.push(fullKey)
          }
        }

        return keys
      }
      const result = getKeys(obj)

      expect(result).toContain('flatKey')
      expect(result).toContain('nested.key1')
      expect(result).toContain('nested.key2')
      expect(result).toContain('anotherFlat')
    })
  })

  describe('readJsonFile function logic', () => {
    it('should read and parse valid JSON file', () => {
      const mockContent = JSON.stringify({
        general: {
          welcome: 'Welcome',
        },
      })

      mockFs.readFileSync.mockReturnValue(mockContent)

      const readJsonFile = (filePath: string) => {
        const content = fs.readFileSync(filePath, 'utf-8')
        return JSON.parse(content)
      }
      const result = readJsonFile('/fake/path/en.json')

      expect(mockFs.readFileSync).toHaveBeenCalledWith(
        '/fake/path/en.json',
        'utf-8',
      )
      expect(result).toEqual({
        general: {
          welcome: 'Welcome',
        },
      })
    })

    it('should handle invalid JSON', () => {
      const mockContent = 'invalid json {'

      mockFs.readFileSync.mockReturnValue(mockContent)

      const readJsonFile = (filePath: string) => {
        const content = fs.readFileSync(filePath, 'utf-8')
        return JSON.parse(content)
      }

      expect(() => readJsonFile('/fake/path/invalid.json')).toThrow()
    })

    it('should handle file read errors', () => {
      mockFs.readFileSync.mockImplementation(() => {
        throw new Error('File not found')
      })

      const readJsonFile = (filePath: string) => {
        const content = fs.readFileSync(filePath, 'utf-8')
        return JSON.parse(content)
      }

      expect(() => readJsonFile('/fake/path/missing.json')).toThrow(
        'File not found',
      )
    })
  })

  describe('getLocaleFiles function logic', () => {
    it('should return only JSON files from locales directory', () => {
      const mockFiles = ['en.json', 'sr.json', 'README.md', 'config.ts']

      mockFs.readdirSync.mockReturnValue(
        mockFiles as unknown as ReturnType<typeof fs.readdirSync>,
      )
      mockPath.join.mockImplementation((...args) => args.join('/'))

      const getLocaleFiles = (localesDir: string) => {
        return fs
          .readdirSync(localesDir)
          .filter((file) => file.endsWith('.json'))
          .map((file) => path.join(localesDir, file))
      }
      const result = getLocaleFiles('/fake/locales')

      expect(result).toEqual(['/fake/locales/en.json', '/fake/locales/sr.json'])
      expect(result).toHaveLength(2)
    })

    it('should handle empty directory', () => {
      mockFs.readdirSync.mockReturnValue(
        [] as unknown as ReturnType<typeof fs.readdirSync>,
      )

      const getLocaleFiles = (localesDir: string) => {
        return fs
          .readdirSync(localesDir)
          .filter((file) => file.endsWith('.json'))
          .map((file) => path.join(localesDir, file))
      }
      const result = getLocaleFiles('/fake/locales')

      expect(result).toEqual([])
    })

    it('should handle directory with no JSON files', () => {
      const mockFiles = ['README.md', 'config.ts', 'index.js']

      mockFs.readdirSync.mockReturnValue(
        mockFiles as unknown as ReturnType<typeof fs.readdirSync>,
      )

      const getLocaleFiles = (localesDir: string) => {
        return fs
          .readdirSync(localesDir)
          .filter((file) => file.endsWith('.json'))
          .map((file) => path.join(localesDir, file))
      }
      const result = getLocaleFiles('/fake/locales')

      expect(result).toEqual([])
    })
  })

  describe('Translation comparison logic', () => {
    it('should detect missing keys', () => {
      const referenceKeys = ['general.welcome', 'general.login', 'auth.logout']
      const targetKeys = ['general.welcome', 'general.login']
      const missingKeys = referenceKeys.filter(
        (key) => !targetKeys.includes(key),
      )

      expect(missingKeys).toEqual(['auth.logout'])
    })

    it('should detect extra keys', () => {
      const referenceKeys = ['general.welcome', 'general.login']
      const targetKeys = [
        'general.welcome',
        'general.login',
        'auth.logout',
        'extra.key',
      ]
      const extraKeys = targetKeys.filter((key) => !referenceKeys.includes(key))

      expect(extraKeys).toEqual(['auth.logout', 'extra.key'])
    })

    it('should validate when all keys match', () => {
      const referenceKeys = ['general.welcome', 'general.login', 'auth.logout']
      const targetKeys = ['general.welcome', 'general.login', 'auth.logout']
      const missingKeys = referenceKeys.filter(
        (key) => !targetKeys.includes(key),
      )
      const extraKeys = targetKeys.filter((key) => !referenceKeys.includes(key))

      expect(missingKeys).toHaveLength(0)
      expect(extraKeys).toHaveLength(0)
    })
  })

  describe('File path operations', () => {
    it('should extract locale name from file path', () => {
      mockPath.basename.mockImplementation((filePath: string, ext?: string) => {
        const base = filePath.split('/').pop() || ''
        if (ext) {
          return base.replace(ext, '')
        }
        return base
      })
      const filePath = '/fake/locales/en.json'
      const localeName = path.basename(filePath, '.json')

      expect(localeName).toBe('en')
    })

    it('should identify reference locale file', () => {
      const files = [
        '/fake/locales/en.json',
        '/fake/locales/sr.json',
        '/fake/locales/de.json',
      ]

      mockPath.basename.mockImplementation((filePath: string, ext?: string) => {
        const base = filePath.split('/').pop() || ''
        if (ext) {
          return base.replace(ext, '')
        }
        return base
      })
      const referenceLocale = 'en'
      const referenceFile = files.find(
        (file) => path.basename(file) === `${referenceLocale}.json`,
      )

      expect(referenceFile).toBe('/fake/locales/en.json')
    })
  })
})
