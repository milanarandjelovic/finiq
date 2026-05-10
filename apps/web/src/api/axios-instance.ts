import Axios from 'axios'

import { ACCESS_TOKEN_COOKIE_NAME } from '@finiq/shared'
import {
  clearAccessToken,
  clearRefreshToken,
  getRefreshToken,
  setAccessToken,
} from '@/lib/cookies'
import { ROUTES } from '@/util/routes'

function clearAuthAndRedirect() {
  clearAccessToken()
  clearRefreshToken()
  window.location.href = ROUTES.LOGIN
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

function getCookie(name: string | undefined): string | null {
  if (!name || typeof document === 'undefined') return null
  const safeName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${safeName}=([^;]*)`),
  )
  return match ? decodeURIComponent(match[1] ?? '') : null
}

export function postRefreshAccessToken(refreshToken: string) {
  return Axios({
    method: 'POST',
    url: `${API_URL}/auth/refresh-access-token`,
    data: { refreshToken },
  })
}

export const axiosInstanceBase = Axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

axiosInstanceBase.interceptors.request.use(
  (config) => {
    const token = getCookie(ACCESS_TOKEN_COOKIE_NAME)
    if (!config.headers.Authorization && token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

axiosInstanceBase.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalConfig = error.config

    if (error.response?.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true

      const refreshToken = getRefreshToken()

      if (!refreshToken) {
        if (typeof window !== 'undefined') {
          clearAuthAndRedirect()
        }
        return Promise.reject(error)
      }

      try {
        const response = await postRefreshAccessToken(refreshToken)
        const newAccessToken = response.data?.data?.accessToken

        if (newAccessToken) {
          setAccessToken(newAccessToken)
          originalConfig.headers.Authorization = `Bearer ${newAccessToken}`
        }

        return axiosInstanceBase(originalConfig)
      } catch {
        if (typeof window !== 'undefined') {
          clearAuthAndRedirect()
        }
        return Promise.reject(error)
      }
    }

    if (Axios.isAxiosError(error) && error.response) {
      return Promise.reject(error.response.data)
    }

    return Promise.reject(error)
  },
)

export const axiosInstance = async <T>(
  url: string,
  options?: RequestInit,
): Promise<T> => {
  const { method = 'GET', body, headers: reqHeaders, signal } = options ?? {}

  let data: unknown = undefined
  if (body !== undefined && body !== null) {
    try {
      data = JSON.parse(body as string)
    } catch {
      data = body
    }
  }

  const response = await axiosInstanceBase({
    url,
    method,
    data,
    headers: reqHeaders as Record<string, string>,
    signal: signal as AbortSignal,
  })

  return {
    data: response.data,
    status: response.status,
    headers: response.headers as unknown as Headers,
  } as T
}

export default axiosInstance
