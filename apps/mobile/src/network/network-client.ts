import axios, { Axios, InternalAxiosRequestConfig } from 'axios'

import { triggerLogout } from '@/network/auth-interceptor'
import { createFiniqContext, createUserAgent } from '@/network/context'
import { getAccessToken, refreshAccessToken } from '@/providers/auth-provider'
import { Env } from '@/util/env'

export class NetworkClient {
  private static _instance: Axios

  constructor() {
    if (NetworkClient._instance) {
      throw new Error(
        'Error: Instantiation failed: Use NetworkClient.getInstance() instead of new.',
      )
    }
  }

  static getInstance(): Axios {
    if (!NetworkClient._instance) {
      this.setInstance()
    }

    return NetworkClient._instance
  }

  static setInstance(): void {
    NetworkClient._instance = axios.create({ baseURL: Env.apiUrl })

    NetworkClient._instance.interceptors.request.use(
      async (config) => {
        const ctx = createFiniqContext()
        config.params = {
          ...config.params,
          ctx: btoa(JSON.stringify(ctx)),
        }

        const token = await getAccessToken()

       if (token) {
          config.headers.set('Authorization', `Bearer ${token}`)
        }

        config.headers.set('User-Agent', createUserAgent())

        return config
      },
      (error) => Promise.reject(error),
    )

    NetworkClient._instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          const newToken = await refreshAccessToken()

          if (newToken) {
            originalRequest.headers.set('Authorization', `Bearer ${newToken}`)

            return NetworkClient._instance.request(originalRequest)
          }

          await triggerLogout()
        }

        return Promise.reject(error)
      },
    )
  }
}
