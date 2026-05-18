import Axios from 'axios'

import { LANGUAGE_STORAGE_KEY } from '@finiq/shared'
import {
  clearAccessToken,
  clearRefreshToken,
  getAccessToken,
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
    const token = getAccessToken()
    if (!config.headers.Authorization && token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    const lang =
      typeof window !== 'undefined'
        ? localStorage.getItem(LANGUAGE_STORAGE_KEY)
        : null
    if (lang) {
      config.headers['x-lang'] = lang
    }

    return config
  },
  (error) => Promise.reject(error),
)

let refreshPromise: Promise<string | null> | null = null

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
        if (!refreshPromise) {
          refreshPromise = postRefreshAccessToken(refreshToken)
            .then((res) => res.data?.data?.accessToken ?? null)
            .finally(() => {
              refreshPromise = null
            })
        }

        const newAccessToken = await refreshPromise

        if (!newAccessToken) {
          if (typeof window !== 'undefined') {
            clearAuthAndRedirect()
          }
          return Promise.reject(error)
        }

        setAccessToken(newAccessToken)
        originalConfig.headers.Authorization = `Bearer ${newAccessToken}`

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
