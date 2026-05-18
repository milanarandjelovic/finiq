import {
  getActiveSpan,
  spanToBaggageHeader,
  spanToTraceHeader,
} from '@sentry/core'
import axios, { Axios, InternalAxiosRequestConfig } from 'axios'
import * as SecureStore from 'expo-secure-store'

import { LANGUAGE_STORAGE_KEY } from '@finiq/shared'
import { triggerLogout } from '@/network/auth-interceptor'
import { createFiniqContext, createUserAgent } from '@/network/context'
import { getAccessToken, refreshAccessToken } from '@/providers/auth-provider'
import { Env } from '@/util/env'

let refreshPromise: Promise<string | null> | null = null

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

    /**
     * Inject Sentry trace headers for distributed tracing (Mobile - API).
     * Native fetch is auto-instrumented, axios requires an explicit interceptor.
     */
    NetworkClient._instance.interceptors.request.use((config) => {
      const activeSpan = getActiveSpan()

      if (activeSpan) {
        const sentryTrace = spanToTraceHeader(activeSpan)
        const baggage = spanToBaggageHeader(activeSpan)

        if (sentryTrace) {
          config.headers.set('sentry-trace', sentryTrace)
        }

        if (baggage) {
          config.headers.set('baggage', baggage)
        }
      }

      return config
    })

    NetworkClient._instance.interceptors.request.use(
      async (config) => {
        const ctx = createFiniqContext()
        config.headers.set('x-finiq-ctx', btoa(JSON.stringify(ctx)))

        const token = await getAccessToken()

        if (token) {
          config.headers.set('Authorization', `Bearer ${token}`)
        }

        const lang = await SecureStore.getItemAsync(LANGUAGE_STORAGE_KEY)

        if (lang) {
          config.headers.set('x-lang', lang.split('-')[0])
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

          if (!refreshPromise) {
            refreshPromise = refreshAccessToken().finally(() => {
              refreshPromise = null
            })
          }

          const newToken = await refreshPromise

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
