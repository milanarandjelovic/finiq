import * as Localization from 'expo-localization'
import * as SecureStore from 'expo-secure-store'
import i18next, { LanguageDetectorAsyncModule } from 'i18next'
import { initReactI18next } from 'react-i18next'

import { LANGUAGE_STORAGE_KEY } from '@finiq/shared'
import { Env } from '@/util/env'

export const detectUserLanguage = async (): Promise<string> => {
  const saved = await SecureStore.getItemAsync(LANGUAGE_STORAGE_KEY)
  const code = saved ?? Localization.getLocales()[0]?.languageCode ?? 'en'
  return code.split('-')[0]
}

const languageDetector: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true,
  detect: async (callback: (lang: string) => void) => {
    const lang = await detectUserLanguage()
    callback(lang)
    return lang
  },
  init: () => {},
  cacheUserLanguage: async (lang: string) => {
    await SecureStore.setItemAsync(LANGUAGE_STORAGE_KEY, lang.split('-')[0])
  },
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
  const normalizedLang = lang.split('-')[0]
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

  await i18next.changeLanguage(normalizedLang)
}

export const clearAllI18nCache = async (): Promise<void> => {}

i18next
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v4',
    fallbackLng: 'en',
    load: 'languageOnly',
    resources: {},
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  })

export default i18next
