import { generatePaginationMetadata } from '@/helpers/pagination'

describe('Pagination', () => {
  describe('generatePaginationMetadata', () => {
    it('should generate metadata for first page with multiple pages', () => {
      const result = generatePaginationMetadata({
        total: 25,
        currentPage: 1,
        perPage: 10,
      })

      expect(result.currentPage).toBe(1)
      expect(result.lastPage).toBe(3)
      expect(result.nextPage).toBe(2)
      expect(result.previousPage).toBeNull()
      expect(result.perPage).toBe(10)
      expect(result.total).toBe(25)
    })

    it('should generate metadata for middle page', () => {
      const result = generatePaginationMetadata({
        total: 25,
        currentPage: 2,
        perPage: 10,
      })

      expect(result.currentPage).toBe(2)
      expect(result.lastPage).toBe(3)
      expect(result.previousPage).toBe(1)
      expect(result.nextPage).toBe(3)
    })

    it('should generate metadata for last page', () => {
      const result = generatePaginationMetadata({
        total: 25,
        currentPage: 3,
        perPage: 10,
      })

      expect(result.currentPage).toBe(3)
      expect(result.previousPage).toBe(2)
      expect(result.nextPage).toBeNull()
    })

    it('should handle single page', () => {
      const result = generatePaginationMetadata({
        total: 5,
        currentPage: 1,
        perPage: 10,
      })

      expect(result.lastPage).toBe(1)
      expect(result.previousPage).toBeNull()
      expect(result.nextPage).toBeNull()
    })

    it('should handle zero results', () => {
      const result = generatePaginationMetadata({
        total: 0,
        currentPage: 1,
        perPage: 10,
      })

      expect(result.lastPage).toBe(0)
      expect(result.total).toBe(0)
    })
  })
})
