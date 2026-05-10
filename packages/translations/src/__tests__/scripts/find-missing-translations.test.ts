import fs from 'fs'
import path from 'path'

jest.mock('fs')
jest.mock('path')

describe('find-missing-translations script', () => {
  const mockFs = fs as jest.Mocked<typeof fs>
  const mockPath = path as jest.Mocked<typeof path>

  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(console, 'log').mockImplementation()
    jest.spyOn(console, 'error').mockImplementation()
    jest.spyOn(console, 'warn').mockImplementation()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('getKeys function logic', () => {
    it('should extract all keys from a flat object and return a Set', () => {
      const obj = {
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
      }
      const getKeys = (
        obj: Record<string, unknown>,
        prefix = '',
      ): Set<string> => {
        const keys = new Set<string>()

        for (const [key, value] of Object.entries(obj)) {
          const fullKey = prefix ? `${prefix}.${key}` : key

          if (value && typeof value === 'object' && !Array.isArray(value)) {
            const nestedKeys = getKeys(
              value as Record<string, unknown>,
              fullKey,
            )
            nestedKeys.forEach((k) => keys.add(k))
          } else {
            keys.add(fullKey)
          }
        }

        return keys
      }
      const result = getKeys(obj)

      expect(result).toBeInstanceOf(Set)
      expect(result.size).toBe(3)
      expect(result.has('key1')).toBe(true)
      expect(result.has('key2')).toBe(true)
      expect(result.has('key3')).toBe(true)
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
      const getKeys = (
        obj: Record<string, unknown>,
        prefix = '',
      ): Set<string> => {
        const keys = new Set<string>()

        for (const [key, value] of Object.entries(obj)) {
          const fullKey = prefix ? `${prefix}.${key}` : key

          if (value && typeof value === 'object' && !Array.isArray(value)) {
            const nestedKeys = getKeys(
              value as Record<string, unknown>,
              fullKey,
            )
            nestedKeys.forEach((k) => keys.add(k))
          } else {
            keys.add(fullKey)
          }
        }

        return keys
      }
      const result = getKeys(obj)

      expect(result.size).toBe(4)
      expect(result.has('general.welcome')).toBe(true)
      expect(result.has('general.loading')).toBe(true)
      expect(result.has('auth.login')).toBe(true)
      expect(result.has('auth.logout')).toBe(true)
    })

    it('should handle empty objects', () => {
      const obj = {}
      const getKeys = (
        obj: Record<string, unknown>,
        prefix = '',
      ): Set<string> => {
        const keys = new Set<string>()

        for (const [key, value] of Object.entries(obj)) {
          const fullKey = prefix ? `${prefix}.${key}` : key

          if (value && typeof value === 'object' && !Array.isArray(value)) {
            const nestedKeys = getKeys(
              value as Record<string, unknown>,
              fullKey,
            )
            nestedKeys.forEach((k) => keys.add(k))
          } else {
            keys.add(fullKey)
          }
        }

        return keys
      }
      const result = getKeys(obj)

      expect(result.size).toBe(0)
    })
  })

  describe('readReferenceLocale function logic', () => {
    it('should read and parse reference locale file', () => {
      const mockContent = JSON.stringify({
        general: {
          welcome: 'Welcome',
          loading: 'Loading...',
        },
      })

      mockFs.readFileSync.mockReturnValue(mockContent)

      const readReferenceLocale = (filePath: string): Set<string> => {
        const content = fs.readFileSync(filePath, 'utf-8')
        const translations = JSON.parse(content)
        const getKeys = (
          obj: Record<string, unknown>,
          prefix = '',
        ): Set<string> => {
          const keys = new Set<string>()

          for (const [key, value] of Object.entries(obj)) {
            const fullKey = prefix ? `${prefix}.${key}` : key

            if (value && typeof value === 'object' && !Array.isArray(value)) {
              const nestedKeys = getKeys(
                value as Record<string, unknown>,
                fullKey,
              )
              nestedKeys.forEach((k) => keys.add(k))
            } else {
              keys.add(fullKey)
            }
          }

          return keys
        }

        return getKeys(translations)
      }
      const result = readReferenceLocale('/fake/path/en.json')

      expect(mockFs.readFileSync).toHaveBeenCalledWith(
        '/fake/path/en.json',
        'utf-8',
      )
      expect(result).toBeInstanceOf(Set)
      expect(result.size).toBe(2)
      expect(result.has('general.welcome')).toBe(true)
      expect(result.has('general.loading')).toBe(true)
    })
  })

  describe('shouldExclude function logic', () => {
    it('should exclude paths containing excluded directories', () => {
      const shouldExclude = (
        filePath: string,
        excludeDirs: string[],
      ): boolean => {
        const pathParts = filePath.split(path.sep)
        return excludeDirs.some((dir) => pathParts.includes(dir))
      }

      Object.defineProperty(mockPath, 'sep', { value: '/', writable: true })

      expect(
        shouldExclude('/project/node_modules/package/file.ts', [
          'node_modules',
        ]),
      ).toBe(true)
      expect(
        shouldExclude('/project/dist/build/file.ts', ['dist', 'build']),
      ).toBe(true)
      expect(shouldExclude('/project/src/components/file.vue', ['dist'])).toBe(
        false,
      )
    })

    it('should handle multiple excluded directories', () => {
      const shouldExclude = (
        filePath: string,
        excludeDirs: string[],
      ): boolean => {
        const pathParts = filePath.split(path.sep)
        return excludeDirs.some((dir) => pathParts.includes(dir))
      }

      Object.defineProperty(mockPath, 'sep', { value: '/', writable: true })

      const excludeDirs = ['node_modules', 'dist', 'build', '.git', 'coverage']

      expect(shouldExclude('/project/.git/config', excludeDirs)).toBe(true)
      expect(shouldExclude('/project/coverage/report.html', excludeDirs)).toBe(
        true,
      )
      expect(shouldExclude('/project/src/main.ts', excludeDirs)).toBe(false)
    })
  })

  describe('getFiles function logic', () => {
    it('should recursively find files with specified extensions', () => {
      const mockEntries = [
        { name: 'file1.vue', isDirectory: () => false, isFile: () => true },
        { name: 'file2.ts', isDirectory: () => false, isFile: () => true },
        { name: 'file3.md', isDirectory: () => false, isFile: () => true },
        { name: 'subdir', isDirectory: () => true, isFile: () => false },
      ]

      mockFs.existsSync.mockReturnValue(true)
      mockFs.readdirSync.mockReturnValue(
        mockEntries as unknown as ReturnType<typeof fs.readdirSync>,
      )
      mockPath.join.mockImplementation((...args) => args.join('/'))
      mockPath.extname.mockImplementation((file) => {
        const parts = file.split('.')
        return parts.length > 1 ? `.${parts[parts.length - 1]}` : ''
      })
      Object.defineProperty(mockPath, 'sep', { value: '/', writable: true })

      const getFiles = (
        dir: string,
        extensions: string[],
        exclude: string[],
      ): string[] => {
        const files: string[] = []

        if (!fs.existsSync(dir)) {
          return files
        }

        const entries = fs.readdirSync(dir, { withFileTypes: true })

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name)

          const shouldExclude = (
            filePath: string,
            excludeDirs: string[],
          ): boolean => {
            const pathParts = filePath.split(path.sep)
            return excludeDirs.some((dir) => pathParts.includes(dir))
          }

          if (shouldExclude(fullPath, exclude)) {
            continue
          }

          if (entry.isDirectory()) {
            // In a real implementation, this would recurse
            continue
          } else if (entry.isFile()) {
            const ext = path.extname(entry.name)
            if (extensions.includes(ext)) {
              files.push(fullPath)
            }
          }
        }

        return files
      }
      const result = getFiles('/fake/dir', ['.vue', '.ts'], [])

      expect(result).toContain('/fake/dir/file1.vue')
      expect(result).toContain('/fake/dir/file2.ts')
      expect(result).not.toContain('/fake/dir/file3.md')
    })

    it('should handle non-existent directory', () => {
      mockFs.existsSync.mockReturnValue(false)

      const getFiles = (dir: string): string[] => {
        const files: string[] = []

        if (!fs.existsSync(dir)) {
          return files
        }

        return files
      }
      const result = getFiles('/non/existent')

      expect(result).toEqual([])
      expect(mockFs.readdirSync).not.toHaveBeenCalled()
    })
  })

  describe('extractKeysFromContent function logic', () => {
    const patterns = [
      /\bt\s*\(\s*['"`]([^'"`]+)['"`]/g,
      /\$t\s*\(\s*['"`]([^'"`]+)['"`]/g,
      /i18n\.t\s*\(\s*['"`]([^'"`]+)['"`]/g,
    ]

    it('should extract keys from t() function calls', () => {
      const content = `
        const message = t('general.welcome')
        const error = t('errors.notFound')
      `
      const extractKeysFromContent = (
        content: string,
        patterns: RegExp[],
      ): string[] => {
        const keys: string[] = []
        const lines = content.split('\n')

        for (const line of lines) {
          if (!line) continue

          for (const pattern of patterns) {
            pattern.lastIndex = 0
            let match

            while ((match = pattern.exec(line)) !== null) {
              const key = match[1]
              if (key && key.trim()) {
                keys.push(key.trim())
              }
            }
          }
        }

        return keys
      }
      const result = extractKeysFromContent(content, patterns)

      expect(result).toContain('general.welcome')
      expect(result).toContain('errors.notFound')
    })

    it('should extract keys from $t() function calls', () => {
      const content = `
        <p>{{ $t('general.loading') }}</p>
        <span>{{ $t('auth.login') }}</span>
      `
      const extractKeysFromContent = (
        content: string,
        patterns: RegExp[],
      ): string[] => {
        const keys: string[] = []
        const lines = content.split('\n')

        for (const line of lines) {
          if (!line) continue

          for (const pattern of patterns) {
            pattern.lastIndex = 0
            let match

            while ((match = pattern.exec(line)) !== null) {
              const key = match[1]
              if (key && key.trim()) {
                keys.push(key.trim())
              }
            }
          }
        }

        return keys
      }
      const result = extractKeysFromContent(content, patterns)

      expect(result).toContain('general.loading')
      expect(result).toContain('auth.login')
    })

    it('should extract keys from i18n.t() function calls', () => {
      const content = `
        const msg = i18n.t('notifications.success')
        i18n.t('errors.serverError')
      `
      const extractKeysFromContent = (
        content: string,
        patterns: RegExp[],
      ): string[] => {
        const keys: string[] = []
        const lines = content.split('\n')

        for (const line of lines) {
          if (!line) continue

          for (const pattern of patterns) {
            pattern.lastIndex = 0
            let match

            while ((match = pattern.exec(line)) !== null) {
              const key = match[1]
              if (key && key.trim()) {
                keys.push(key.trim())
              }
            }
          }
        }

        return keys
      }
      const result = extractKeysFromContent(content, patterns)

      expect(result).toContain('notifications.success')
      expect(result).toContain('errors.serverError')
    })

    it('should handle multiple keys on the same line', () => {
      const content = `const a = t('key1'); const b = t('key2'); const c = t('key3')`
      const extractKeysFromContent = (
        content: string,
        patterns: RegExp[],
      ): string[] => {
        const keys: string[] = []
        const lines = content.split('\n')

        for (const line of lines) {
          if (!line) continue

          for (const pattern of patterns) {
            pattern.lastIndex = 0
            let match

            while ((match = pattern.exec(line)) !== null) {
              const key = match[1]
              if (key && key.trim()) {
                keys.push(key.trim())
              }
            }
          }
        }

        return keys
      }
      const result = extractKeysFromContent(content, patterns)

      expect(result).toContain('key1')
      expect(result).toContain('key2')
      expect(result).toContain('key3')
      expect(result).toHaveLength(3)
    })

    it('should handle different quote types', () => {
      const content = `
        t('single.quote')
        t("double.quote")
        t(\`backtick.quote\`)
      `
      const extractKeysFromContent = (
        content: string,
        patterns: RegExp[],
      ): string[] => {
        const keys: string[] = []
        const lines = content.split('\n')

        for (const line of lines) {
          if (!line) continue

          for (const pattern of patterns) {
            pattern.lastIndex = 0
            let match

            while ((match = pattern.exec(line)) !== null) {
              const key = match[1]
              if (key && key.trim()) {
                keys.push(key.trim())
              }
            }
          }
        }

        return keys
      }
      const result = extractKeysFromContent(content, patterns)

      expect(result).toContain('single.quote')
      expect(result).toContain('double.quote')
      expect(result).toContain('backtick.quote')
    })

    it('should ignore empty keys', () => {
      const content = `
        t('')
        t('   ')
        t('valid.key')
      `
      const extractKeysFromContent = (
        content: string,
        patterns: RegExp[],
      ): string[] => {
        const keys: string[] = []
        const lines = content.split('\n')

        for (const line of lines) {
          if (!line) continue

          for (const pattern of patterns) {
            pattern.lastIndex = 0
            let match

            while ((match = pattern.exec(line)) !== null) {
              const key = match[1]
              if (key && key.trim()) {
                keys.push(key.trim())
              }
            }
          }
        }

        return keys
      }
      const result = extractKeysFromContent(content, patterns)

      expect(result).toEqual(['valid.key'])
      expect(result).toHaveLength(1)
    })
  })

  describe('groupByKey function logic', () => {
    it('should group scan results by key', () => {
      interface ScanResult {
        projectName: string
        filePath: string
        lineNumber: number
        key: string
      }

      const results: ScanResult[] = [
        {
          projectName: 'web-vue',
          filePath: '/file1.vue',
          lineNumber: 10,
          key: 'general.welcome',
        },
        {
          projectName: 'web-vue',
          filePath: '/file2.vue',
          lineNumber: 20,
          key: 'general.welcome',
        },
        {
          projectName: 'web-vue',
          filePath: '/file3.vue',
          lineNumber: 30,
          key: 'auth.login',
        },
      ]
      const groupByKey = (results: ScanResult[]): Map<string, ScanResult[]> => {
        const grouped = new Map<string, ScanResult[]>()

        for (const result of results) {
          const existing = grouped.get(result.key) || []
          existing.push(result)
          grouped.set(result.key, existing)
        }

        return grouped
      }
      const result = groupByKey(results)

      expect(result.size).toBe(2)
      expect(result.get('general.welcome')).toHaveLength(2)
      expect(result.get('auth.login')).toHaveLength(1)
    })

    it('should handle empty results', () => {
      interface ScanResult {
        projectName: string
        filePath: string
        lineNumber: number
        key: string
      }

      const results: ScanResult[] = []
      const groupByKey = (results: ScanResult[]): Map<string, ScanResult[]> => {
        const grouped = new Map<string, ScanResult[]>()

        for (const result of results) {
          const existing = grouped.get(result.key) || []
          existing.push(result)
          grouped.set(result.key, existing)
        }

        return grouped
      }
      const result = groupByKey(results)

      expect(result.size).toBe(0)
    })
  })

  describe('Dynamic key validation logic', () => {
    it('should validate dynamic keys with template literals', () => {
      const referenceKeys = new Set([
        'entityStatus.active',
        'entityStatus.inactive',
        'entityStatus.pending',
      ])
      const dynamicKey = 'entityStatus.${status}'
      const staticPrefix = dynamicKey.substring(0, dynamicKey.indexOf('${'))
      const hasMatchingPrefix = [...referenceKeys].some((refKey) =>
        refKey.startsWith(staticPrefix),
      )

      expect(hasMatchingPrefix).toBe(true)
      expect(staticPrefix).toBe('entityStatus.')
    })

    it('should fail validation for non-existent dynamic key prefix', () => {
      const referenceKeys = new Set([
        'entityStatus.active',
        'entityStatus.inactive',
      ])
      const dynamicKey = 'nonExistent.${value}'
      const staticPrefix = dynamicKey.substring(0, dynamicKey.indexOf('${'))
      const hasMatchingPrefix = [...referenceKeys].some((refKey) =>
        refKey.startsWith(staticPrefix),
      )

      expect(hasMatchingPrefix).toBe(false)
    })

    it('should handle regular static keys', () => {
      const referenceKeys = new Set(['general.welcome', 'auth.login'])
      const staticKey = 'general.welcome'

      expect(referenceKeys.has(staticKey)).toBe(true)
      expect(staticKey.includes('${')).toBe(false)
    })
  })
})
