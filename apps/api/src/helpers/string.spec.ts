import { parseCommaSeparatedValues } from '@/helpers/string'

describe('String', () => {
  describe('parseCommaSeparatedValues', () => {
    it('should split comma-separated string into array', () => {
      expect(parseCommaSeparatedValues('a,b,c')).toEqual(['a', 'b', 'c'])
    })

    it('should trim whitespace around values', () => {
      expect(parseCommaSeparatedValues(' a , b , c ')).toEqual(['a', 'b', 'c'])
    })

    it('should filter out empty strings', () => {
      expect(parseCommaSeparatedValues('a,,b,')).toEqual(['a', 'b'])
    })

    it('should return empty array for empty string', () => {
      expect(parseCommaSeparatedValues('')).toEqual([])
    })
  })
})
