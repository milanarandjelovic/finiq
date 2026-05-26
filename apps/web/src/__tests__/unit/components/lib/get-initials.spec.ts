import { getInitials } from '@/lib/get-initials'

describe('getInitials', () => {
  it('should render single initial for a single name', () => {
    expect(getInitials('John')).toBe('J')
  })

  it('should render two initials for a first and last name', () => {
    expect(getInitials('John Doe')).toBe('JD')
  })

  it('should return two initials for three-part name', () => {
    expect(getInitials('John Michael Doe')).toBe('JM')
  })

  it('should handle lowercase input', () => {
    expect(getInitials('john doe')).toBe('JD')
  })

  it('should handle extra whitespace', () => {
    expect(getInitials('  John   Doe  ')).toBe('JD')
  })

  it('should return "?" for null', () => {
    expect(getInitials(null)).toBe('?')
  })

  it('should return "?" for undefined', () => {
    expect(getInitials(undefined)).toBe('?')
  })

  it('should return "?" for empty string', () => {
    expect(getInitials('')).toBe('?')
  })
})
