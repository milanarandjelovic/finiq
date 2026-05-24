import { i18nMsg } from '@/shared/helpers/i18n-msg.helper'

describe('i18nMsg', () => {
  it('should return a function', () => {
    const result = i18nMsg('validation.emailValid' as any)

    expect(typeof result).toBe('function')
  })
})
