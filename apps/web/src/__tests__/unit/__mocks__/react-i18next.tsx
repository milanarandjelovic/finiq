export const initReactI18next = {}

export const I18nextProvider = ({ children }: { children: React.ReactNode }) =>
  children

export const useTranslation = () => ({
  t: (key: string) => key,
  i18n: { language: 'en' },
})

export function createI18nMock(
  translations: Record<string, string> = {},
  tFn?: (key: string, opts?: any) => string,
) {
  return {
    useTranslation: () => ({
      t: tFn ?? ((key: string) => translations[key] ?? key),
      i18n: { language: 'en' },
    }),
    initReactI18next,
    I18nextProvider,
  }
}
