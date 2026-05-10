import { enUS, srLatn } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'

const localeMap = { en: enUS, sr: srLatn }

export const useDateLocale = () => {
  const { i18n } = useTranslation()
  return localeMap[i18n.language as keyof typeof localeMap] ?? enUS
}
