import en from './locales/en.json'
import sr from './locales/sr.json'

export const translations = {
  en,
  sr,
} as const

export const LANG_LOCALES = ['en', 'sr'] as const
export const LANG_DEFAULT_LOCALES = 'en' as const

export type LangLocale = (typeof LANG_LOCALES)[number]

type DeepKeys<T, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends Record<string, unknown>
    ? DeepKeys<T[K], `${Prefix}${K}.`>
    : `${Prefix}${K}`
}[keyof T & string]

export type TranslationKey = DeepKeys<typeof en>

export { en, sr }
