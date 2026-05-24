import { JsonTranslationsLoader } from '@/providers/i18n/json-translations.loader'

jest.mock('@finiq/translations', () => ({
  translations: { en: {}, sr: {} },
}))

describe('JsonTranslationsLoader', () => {
  let loader: JsonTranslationsLoader

  beforeEach(() => {
    loader = new JsonTranslationsLoader()
  })

  it('languages: should return language codes from translations', async () => {
    const languages = await loader.languages()

    expect(languages).toEqual(['en', 'sr'])
  })

  it('load: should return the translations object', async () => {
    const result = await loader.load()

    expect(result).toEqual({ en: {}, sr: {} })
  })
})
