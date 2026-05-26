import { getSortingStateParser, sortingItemSchema } from '@/lib/parser'

describe('sortingItemSchema', () => {
  it('should validate a valid sort item', () => {
    expect(
      sortingItemSchema.safeParse({ id: 'name', desc: false }).success,
    ).toBe(true)
  })

  it('should reject missing desc', () => {
    expect(sortingItemSchema.safeParse({ id: 'name' }).success).toBe(false)
  })

  it('should reject missing id', () => {
    expect(sortingItemSchema.safeParse({ desc: true }).success).toBe(false)
  })

  it('should reject non-boolean desc', () => {
    expect(
      sortingItemSchema.safeParse({ id: 'name', desc: 'yes' }).success,
    ).toBe(false)
  })
})

describe('getSortingStateParser', () => {
  const parser = getSortingStateParser<Record<string, unknown>>()

  it('should parse a valid JSON string', () => {
    expect(parser.parse('[{"id":"name","desc":false}]')).toEqual([
      { id: 'name', desc: false },
    ])
  })

  it('should return null for invalid JSON', () => {
    expect(parser.parse('not-json')).toBeNull()
  })

  it('should return null for non-array JSON', () => {
    expect(parser.parse('{"id":"name"}')).toBeNull()
  })

  it('should return null for items missing fields', () => {
    expect(parser.parse('[{"id":"name"}]')).toBeNull()
  })

  it('should serialize to JSON string', () => {
    expect(parser.serialize([{ id: 'name', desc: true }])).toBe(
      '[{"id":"name","desc":true}]',
    )
  })

  it('eq should compare equal arrays', () => {
    expect(
      parser.eq([{ id: 'name', desc: false }], [{ id: 'name', desc: false }]),
    ).toBe(true)
  })

  it('eq should detect different arrays', () => {
    expect(
      parser.eq([{ id: 'name', desc: false }], [{ id: 'name', desc: true }]),
    ).toBe(false)
  })

  it('eq should detect different lengths', () => {
    expect(
      parser.eq(
        [{ id: 'name', desc: false }],
        [
          { id: 'name', desc: false },
          { id: 'age', desc: true },
        ],
      ),
    ).toBe(false)
  })
})

describe('getSortingStateParser with originalRow', () => {
  const row = { name: 'Alice', age: 30 }

  it('should reject keys not in row', () => {
    const parser = getSortingStateParser(row as any)

    expect(parser.parse('[{"id":"nonexistent","desc":false}]')).toBeNull()
  })

  it('should accept valid keys', () => {
    const parser = getSortingStateParser(row as any)

    expect(parser.parse('[{"id":"name","desc":false}]')).toEqual([
      { id: 'name', desc: false },
    ])
  })
})
