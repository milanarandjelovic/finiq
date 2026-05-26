import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('js-cookie', () => ({
  default: { get: vi.fn(), set: vi.fn(), remove: vi.fn() },
}))

vi.mock('@finiq/translations', () => ({
  translations: { en: { hello: 'Hello' }, sr: { hello: 'Zdravo' } },
}))

vi.mock('@/util/env', () => ({
  Env: { apiUrl: 'http://localhost:3000', i18nUrl: 'http://localhost:3001' },
  ClientEnv: {
    apiUrl: 'http://localhost:3000',
    i18nUrl: 'http://localhost:3001',
  },
}))

vi.mock('react-i18next', () => ({
  initReactI18next: {},
}))

const mockI18next = vi.hoisted(() => ({
  isInitialized: false,
  use: vi.fn().mockReturnThis(),
  init: vi.fn().mockResolvedValue(undefined),
  addResourceBundle: vi.fn(),
  changeLanguage: vi.fn().mockResolvedValue(undefined),
  emit: vi.fn(),
}))

vi.mock('i18next', () => ({
  default: mockI18next,
}))

describe('detectUserLanguage', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('should return language from cookie when set', async () => {
    const Cookies = (await import('js-cookie')).default
    vi.mocked(Cookies.get).mockReturnValue('sr')

    const { detectUserLanguage } = await import('@/i18n')
    const lang = await detectUserLanguage()

    expect(lang).toBe('sr')
  })

  it('should detect from navigator.language when no cookie', async () => {
    const Cookies = (await import('js-cookie')).default
    vi.mocked(Cookies.get).mockReturnValue(undefined)
    Object.defineProperty(globalThis, 'navigator', {
      value: { language: 'de-DE' },
      configurable: true,
    })

    const { detectUserLanguage } = await import('@/i18n')
    const lang = await detectUserLanguage()

    expect(lang).toBe('de')
  })

  it('should default to "en" when no cookie and no navigator', async () => {
    const Cookies = (await import('js-cookie')).default
    vi.mocked(Cookies.get).mockReturnValue(undefined)
    delete (globalThis as any).navigator

    const { detectUserLanguage } = await import('@/i18n')
    const lang = await detectUserLanguage()

    expect(lang).toBe('en')
  })
})

describe('changeLanguage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockI18next.use.mockReturnValue(mockI18next)
    mockI18next.changeLanguage.mockResolvedValue(undefined)
  })

  it('should use bundled translations when available', async () => {
    const { changeLanguage } = await import('@/i18n')
    await changeLanguage('en')

    expect(mockI18next.addResourceBundle).toHaveBeenCalledWith(
      'en',
      'translation',
      { hello: 'Hello' },
      true,
      true,
    )
    expect(mockI18next.changeLanguage).toHaveBeenCalledWith('en')
    expect(mockI18next.emit).toHaveBeenCalledWith('languageChanged', 'en')
  })

  it('should normalize language code before lookup', async () => {
    const { changeLanguage } = await import('@/i18n')
    await changeLanguage('sr-RS')

    expect(mockI18next.addResourceBundle).toHaveBeenCalledWith(
      'sr',
      'translation',
      { hello: 'Zdravo' },
      true,
      true,
    )
    expect(mockI18next.changeLanguage).toHaveBeenCalledWith('sr')
  })

  it('should fetch translations when language is not bundled', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ greeting: 'Hola' }),
    })

    const { changeLanguage } = await import('@/i18n')
    await changeLanguage('es')

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'http://localhost:3001/locales/es',
      expect.any(Object),
    )
    expect(mockI18next.addResourceBundle).toHaveBeenCalledWith(
      'es',
      'translation',
      { greeting: 'Hola' },
      true,
      true,
    )
  })

  it('should not add resource bundle when fetch response is not ok', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: false })

    const { changeLanguage } = await import('@/i18n')
    await changeLanguage('fr')

    expect(mockI18next.addResourceBundle).not.toHaveBeenCalled()
  })

  it('should not add resource bundle when fetch throws', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

    const { changeLanguage } = await import('@/i18n')
    await changeLanguage('de')

    expect(mockI18next.addResourceBundle).not.toHaveBeenCalled()
  })
})

describe('clearAllI18nCache', () => {
  it('should resolve without error', async () => {
    const { clearAllI18nCache } = await import('@/i18n')

    await expect(clearAllI18nCache()).resolves.toBeUndefined()
  })
})

describe('initI18n', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    mockI18next.isInitialized = false
    mockI18next.use.mockReturnValue(mockI18next)
    mockI18next.init.mockResolvedValue(undefined)
  })

  it('should return early when window is undefined', async () => {
    const g = globalThis as any
    const win = g.window
    g.window = undefined

    const { initI18n } = await import('@/i18n')
    const result = await initI18n()

    expect(result).toBeDefined()
    expect(mockI18next.init).not.toHaveBeenCalled()
    g.window = win
  })

  it('should return early when already initialized', async () => {
    mockI18next.isInitialized = true

    const { initI18n } = await import('@/i18n')
    const result = await initI18n()

    expect(result).toBeDefined()
    expect(mockI18next.init).not.toHaveBeenCalled()
  })

  it('should initialize i18next when window is defined and not initialized', async () => {
    const { initI18n } = await import('@/i18n')
    await initI18n()

    expect(mockI18next.use).toHaveBeenCalled()
    expect(mockI18next.init).toHaveBeenCalledWith(
      expect.objectContaining({
        lng: 'en',
        fallbackLng: 'en',
      }),
    )
  })
})
