import { RestfulResponseDto } from '@/shared/dtos/restful-response.dto'

describe('RestfulResponseDto', () => {
  it('should create with message and data', () => {
    const dto = new RestfulResponseDto({
      message: 'Success',
      data: { foo: 'bar' },
    })

    expect(dto.message).toBe('Success')
    expect(dto.data).toEqual({ foo: 'bar' })
  })

  it('should handle null data', () => {
    const dto = new RestfulResponseDto({
      message: 'No content',
      data: null,
    })

    expect(dto.message).toBe('No content')
    expect(dto.data).toBeNull()
  })

  it('should handle array data', () => {
    const dto = new RestfulResponseDto({
      message: 'List',
      data: ['en', 'sr'],
    })

    expect(dto.message).toBe('List')
    expect(dto.data).toEqual(['en', 'sr'])
  })
})
