import {
  clearAccessToken,
  clearRefreshToken,
  getAccessToken,
  getCookieValue,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from '@/lib/cookies'

describe('cookies', () => {
  beforeEach(() => {
    clearAccessToken()
    clearRefreshToken()
  })

  describe('accessToken', () => {
    it('should return null when cookie is not set', () => {
      expect(getAccessToken()).toBeNull()
    })

    it('should return the token value when set', () => {
      setAccessToken('eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0')

      expect(getAccessToken()).toBe(
        'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0',
      )
    })

    it('should return null after clear token', () => {
      const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0'
      setAccessToken(token)
      clearAccessToken()

      expect(getAccessToken()).toBeNull()
    })

    it('should handle URL-encoded token value', () => {
      const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0'
      setAccessToken(token)

      expect(getAccessToken()).toBe(token)
    })
  })

  describe('refreshToken', () => {
    it('should return the refresh token when set', () => {
      const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0'
      setRefreshToken(token)

      expect(getRefreshToken()).toBe(token)
    })

    it('should return null after clearRefreshToken', () => {
      const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0'
      setRefreshToken(token)
      clearRefreshToken()

      expect(getRefreshToken()).toBeNull()
    })
  })

  describe('getCookieValue', () => {
    it('should return null when cookie does not exist', () => {
      expect(getCookieValue('unknown')).toBeNull()
    })

    it('should return the cookie value', () => {
      document.cookie =
        'test_token=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0'

      expect(getCookieValue('test_token')).toBe(
        'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0',
      )
    })

    it('should return decoded value for URL-encoded cookie', () => {
      document.cookie = `test_encoded=${encodeURIComponent('hello world')}`

      expect(getCookieValue('test_encoded')).toBe('hello world')
    })

    it('should return empty string for empty cookie value', () => {
      document.cookie = 'test_empty='

      expect(getCookieValue('test_empty')).toBe('')
    })

    it('should return correct value when multiple cookies exist', () => {
      document.cookie =
        'test_a=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0'
      document.cookie =
        'test_b=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI5ODc2NTQzMjEwIn0'

      expect(getCookieValue('test_a')).toBe(
        'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0',
      )
      expect(getCookieValue('test_b')).toBe(
        'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI5ODc2NTQzMjEwIn0',
      )
    })

    it('should return null when document is undefined', () => {
      const g = globalThis as any
      const origDoc = g.document
      g.document = undefined

      expect(getCookieValue('test_token')).toBeNull()
      g.document = origDoc
    })
  })

  describe('SSR guard', () => {
    it('should return null when document is undefined', () => {
      const g = globalThis as any
      const origDoc = g.document
      g.document = undefined

      expect(getAccessToken()).toBeNull()
      expect(getRefreshToken()).toBeNull()
      g.document = origDoc
    })
  })
})
