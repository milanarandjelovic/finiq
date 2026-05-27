import Axios from 'axios'
import { vi } from 'vitest'

import {
  axiosInstance,
  axiosInstanceBase,
  postRefreshAccessToken,
} from '@/api/axios-instance'

vi.mock('axios', async (importOriginal) => {
  const mod = await importOriginal<typeof import('axios')>()
  const mockAxios = vi.fn() as any
  Object.assign(mockAxios, mod.default)

  return { ...mod, default: mockAxios }
})

vi.mock('@/lib/cookies', () => ({
  getAccessToken: vi.fn().mockReturnValue('mock-token'),
  getRefreshToken: vi.fn().mockReturnValue('mock-refresh'),
  setAccessToken: vi.fn(),
  clearAccessToken: vi.fn(),
  clearRefreshToken: vi.fn(),
}))

describe('postRefreshAccessToken', () => {
  it('should POST to /auth/refresh-access-token', async () => {
    vi.mocked(Axios).mockResolvedValueOnce({
      data: { accessToken: 'new-token' },
    })

    await postRefreshAccessToken('my-refresh')

    expect(vi.mocked(Axios)).toHaveBeenCalledWith({
      method: 'POST',
      url: 'http://localhost:4000/auth/refresh-access-token',
      data: { refreshToken: 'my-refresh' },
    })
  })
})

describe('axiosInstanceBase', () => {
  it('should have the correct default baseURL', () => {
    expect(axiosInstanceBase.defaults.baseURL).toBe('http://localhost:4000')
  })

  it('should have withCredentials set to true', () => {
    expect(axiosInstanceBase.defaults.withCredentials).toBe(true)
  })

  it('should have JSON content type headers', () => {
    expect(axiosInstanceBase.defaults.headers['Content-Type']).toBe(
      'application/json',
    )
    expect(axiosInstanceBase.defaults.headers['Accept']).toBe(
      'application/json',
    )
  })
})

describe('axiosInstance', () => {
  let savedAdapter: any
  let mockAdapter: ReturnType<typeof vi.fn>

  beforeEach(() => {
    savedAdapter = axiosInstanceBase.defaults.adapter
    mockAdapter = vi.fn().mockResolvedValue({
      data: { id: 1 },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    })
    axiosInstanceBase.defaults.adapter = mockAdapter
  })

  afterEach(() => {
    axiosInstanceBase.defaults.adapter = savedAdapter
  })

  it('should call axiosInstanceBase with the url', async () => {
    await axiosInstance('/api/test')

    expect(mockAdapter).toHaveBeenCalledWith(
      expect.objectContaining({ url: '/api/test' }),
    )
  })

  it('should parse JSON body and pass as data', async () => {
    await axiosInstance('/api/test', {
      method: 'POST',
      body: JSON.stringify({ name: 'John' }),
    })

    expect(mockAdapter).toHaveBeenCalledWith(
      expect.objectContaining({ data: JSON.stringify({ name: 'John' }) }),
    )
  })

  it('should pass body as-is when JSON.parse fails', async () => {
    await axiosInstance('/api/test', {
      method: 'POST',
      body: 'plain-text-body' as any,
    })

    expect(mockAdapter).toHaveBeenCalledWith(
      expect.objectContaining({ data: JSON.stringify('plain-text-body') }),
    )
  })

  it('should return data, status and headers from the response', async () => {
    const result = await axiosInstance<{
      data: { id: number }
      status: number
      headers: Headers
    }>('/api/test')

    expect(result.data).toEqual({ id: 1 })
    expect(result.status).toBe(200)
  })

  it('should default to GET method when none is provided', async () => {
    await axiosInstance('/api/test')

    expect(mockAdapter).toHaveBeenCalledWith(
      expect.objectContaining({ method: 'get' }),
    )
  })
})
