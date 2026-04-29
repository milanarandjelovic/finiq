import * as Localization from 'expo-localization'
import * as SecureStore from 'expo-secure-store'
import i18next, { LanguageDetectorAsyncModule } from 'i18next'
import { initReactI18next } from 'react-i18next'

import { LANGUAGE_STORAGE_KEY } from '@finiq/shared'
import { Env } from '@/util/env'

export const detectUserLanguage = async (): Promise<string> => {
  const saved = await SecureStore.getItemAsync(LANGUAGE_STORAGE_KEY)

  return saved ?? Localization.getLocales()[0]?.languageCode ?? 'en'
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
    await SecureStore.setItemAsync(LANGUAGE_STORAGE_KEY, lang)
  },
}

const fetchTranslations = async (
  lang: string,
): Promise<Record<string, unknown> | null> => {
  try {
    const response = await fetch(`${Env.i18nUrl}/locales/${lang}`)

    if (!response.ok) {
      if (lang !== 'en') {
        return fetchTranslations('en')
      }

      return null
    }

    return response.json()
  } catch {
    console.error(`[i18n] Failed to fetch translations for "${lang}"`)

    return null
  }
}

export const changeLanguage = async (lang: string): Promise<void> => {
  const translations = await fetchTranslations(lang)

  if (translations) {
    i18next.addResourceBundle(lang, 'translation', translations, true, true)
  }

  await i18next.changeLanguage(lang)
}

i18next
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v4',
    fallbackLng: 'en',
    resources: {},
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  })

export default i18next
