import { translations } from '@finiq/translations'
import { I18nLoader, type I18nTranslation } from 'nestjs-i18n'

export class JsonTranslationsLoader extends I18nLoader {
  async languages(): Promise<string[]> {
    return Object.keys(translations)
  }

  async load(): Promise<I18nTranslation> {
    return translations as unknown as I18nTranslation
  }
}
