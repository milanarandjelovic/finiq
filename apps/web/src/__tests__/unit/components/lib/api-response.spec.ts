import { unwrapApiResponse } from '@/lib/api-response'

const g = globalThis as any
g.document = undefined

describe('unwrapApiResponse', () => {
  it('should return undefined for undefined input', () => {
    expect(unwrapApiResponse(undefined)).toBeUndefined()
  })

  it('should return null for null input', () => {
    expect(unwrapApiResponse(null)).toBeNull()
  })

  it('should pass through a string', () => {
    expect(unwrapApiResponse('hello')).toBe('hello')
  })

  it('should pass through an object', () => {
    const object = {
      foo: 'bar',
    }

    expect(unwrapApiResponse(object)).toBe(object)
  })

  it('should pass through a number', () => {
    expect(unwrapApiResponse(42)).toBe(42)
  })
})
