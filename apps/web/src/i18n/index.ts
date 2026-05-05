import { translations as bundledTranslations } from '@finiq/translations'
import i18next from 'i18next'
import Cookies from 'js-cookie'
import { initReactI18next } from 'react-i18next'

import { LANGUAGE_STORAGE_KEY } from '@finiq/shared'
import { Env } from '@/util/env'

export const detectUserLanguage = async (): Promise<string> => {
  const saved = Cookies.get(LANGUAGE_STORAGE_KEY)
  if (saved) return saved

  if (typeof navigator !== 'undefined') {
    const code = navigator.language ?? 'en'
    return (code.split('-')[0] ?? 'en') as string
  }

  return 'en'
}

const fetchTranslations = async (
  lang: string,
): Promise<Record<string, unknown> | null> => {
  try {
    const response = await fetch(`${Env.i18nUrl}/locales/${lang}`, {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache',
      },
    })

    if (!response.ok) {
      return null
    }

    return response.json()
  } catch {
    return null
  }
}

export const changeLanguage = async (lang: string): Promise<void> => {
  const normalizedLang = (lang.split('-')[0] ?? lang) as string

  // Try to use bundled translations first
  if (bundledTranslations[normalizedLang as keyof typeof bundledTranslations]) {
    i18next.addResourceBundle(
      normalizedLang,
      'translation',
      bundledTranslations[normalizedLang as keyof typeof bundledTranslations],
      true,
      true,
    )
  } else {
    // Fallback to fetching from server
    const translations = await fetchTranslations(normalizedLang)
    if (translations) {
      i18next.addResourceBundle(
        normalizedLang,
        'translation',
        translations,
        true,
        true,
      )
    }
  }

  await i18next.changeLanguage(normalizedLang)
  i18next.emit('languageChanged', normalizedLang)
}

export const clearAllI18nCache = async (): Promise<void> => {}

export const initI18n = async (): Promise<typeof i18next> => {
  if (typeof window === 'undefined') return i18next

  const languageDetector = {
    type: 'languageDetector' as const,
    async: true,
    detect: async (callback: (lang: string) => void) => {
      const lang = await detectUserLanguage()
      callback(lang)
      return lang
    },
    init: () => {},
    cacheUserLanguage: async (lang: string) => {
      const code = (lang.split('-')[0] ?? lang) as string
      Cookies.set(LANGUAGE_STORAGE_KEY, code, { expires: 365 })
    },
  }

  await i18next
    .use(languageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: 'en',
      load: 'languageOnly',
      resources: Object.entries(bundledTranslations).reduce(
        (acc, [lang, translation]) => {
          acc[lang] = { translation }
          return acc
        },
        {} as Record<string, { translation: Record<string, unknown> }>,
      ),
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    })

  return i18next
}

export default i18next
