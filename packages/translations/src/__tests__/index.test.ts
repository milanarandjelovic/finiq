import {
  en,
  LANG_DEFAULT_LOCALES,
  LANG_LOCALES,
  translations,
  type LangLocale,
} from '../index'

describe('Translations Package', () => {
  describe('translations object', () => {
    it('should export translations object with en locale', () => {
      expect(translations).toBeDefined()
      expect(translations.en).toBeDefined()
    })

    it('should export translations as const object', () => {
      expect(Object.isFrozen(translations)).toBe(false)
      expect(typeof translations).toBe('object')
    })
  })

  describe('individual locale exports', () => {
    it('should export en locale separately', () => {
      expect(en).toBeDefined()
      expect(typeof en).toBe('object')
      expect(en).toBe(translations.en)
    })

    it('should have general section in en locale', () => {
      expect(en.general).toBeDefined()
      expect(typeof en.general).toBe('object')
    })

    it('should have basic translation keys in en.general', () => {
      expect(en.general.welcome).toBeDefined()
      expect(en.general.loading).toBeDefined()
      expect(en.general.error).toBeDefined()
      expect(en.general.success).toBeDefined()
    })
  })

  describe('LANG_LOCALES constant', () => {
    it('should export LANG_LOCALES as readonly array', () => {
      expect(LANG_LOCALES).toBeDefined()
      expect(Array.isArray(LANG_LOCALES)).toBe(true)
    })

    it('should contain en locale', () => {
      expect(LANG_LOCALES).toContain('en')
    })

    it('should contain sr locale', () => {
      expect(LANG_LOCALES).toContain('sr')
    })

    it('should have exactly 2 locales', () => {
      expect(LANG_LOCALES).toHaveLength(2)
    })

    it('should have en as first locale', () => {
      expect(LANG_LOCALES[0]).toBe('en')
    })
  })

  describe('LANG_DEFAULT_LOCALES constant', () => {
    it('should export LANG_DEFAULT_LOCALES', () => {
      expect(LANG_DEFAULT_LOCALES).toBeDefined()
    })

    it('should be set to en', () => {
      expect(LANG_DEFAULT_LOCALES).toBe('en')
    })

    it('should be included in LANG_LOCALES', () => {
      expect(LANG_LOCALES).toContain(LANG_DEFAULT_LOCALES)
    })
  })

  describe('LangLocale type', () => {
    it('should allow valid locale values', () => {
      const enLocale: LangLocale = 'en'

      expect(enLocale).toBe('en')
    })

    it('should match LANG_LOCALES values', () => {
      const locales: LangLocale[] = ['en']

      locales.forEach((locale) => {
        expect(LANG_LOCALES).toContain(locale)
      })
    })
  })

  describe('translation structure validation', () => {
    it('should have nested structure', () => {
      expect(typeof en.general).toBe('object')
    })

    it('should have string values for leaf nodes', () => {
      expect(typeof en.general.welcome).toBe('string')
    })

    it('should not have empty strings in en locale', () => {
      const checkForEmptyStrings = (
        obj: Record<string, unknown>,
        path = '',
      ): string[] => {
        const emptyKeys: string[] = []

        for (const [key, value] of Object.entries(obj)) {
          const currentPath = path ? `${path}.${key}` : key

          if (typeof value === 'string' && value.trim() === '') {
            emptyKeys.push(currentPath)
          } else if (typeof value === 'object' && value !== null) {
            emptyKeys.push(
              ...checkForEmptyStrings(
                value as Record<string, unknown>,
                currentPath,
              ),
            )
          }
        }

        return emptyKeys
      }

      const emptyKeys = checkForEmptyStrings(en)
      expect(emptyKeys).toHaveLength(0)
    })
  })
})
