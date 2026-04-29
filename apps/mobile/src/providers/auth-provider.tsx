import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'

import {
  ACCESS_TOKEN_COOKIE_NAME,
  EXPIRES_AT_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from '@finiq/shared'
import { registerLogoutCallback } from '@/network/auth-interceptor'
import { type AuthContextType, type TokenPayload } from '@/types/auth'
import { Env } from '@/util/env'

const clearTokens = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_COOKIE_NAME)
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_COOKIE_NAME)
  await SecureStore.deleteItemAsync(EXPIRES_AT_COOKIE_NAME)
}

export const clearAccessToken = async (): Promise<void> =>
  SecureStore.deleteItemAsync(ACCESS_TOKEN_COOKIE_NAME)

export const clearRefreshToken = async (): Promise<void> =>
  SecureStore.deleteItemAsync(REFRESH_TOKEN_COOKIE_NAME)

let refreshTokenPromise: Promise<string | null> | undefined = undefined

export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_COOKIE_NAME)

  if (!refreshToken) {
    await clearTokens()

    return null
  }

  if (!refreshTokenPromise) {
    refreshTokenPromise = axios
      .post<{ data: { accessToken: string; expiresIn: number } }>(
        `${Env.apiUrl}/auth/refresh-access-token`,
        { refreshToken },
      )
      .then(async (res) => {
        const { accessToken, expiresIn } = res.data.data
        const expiresAt = Date.now() + expiresIn * 1000

        await SecureStore.setItemAsync(ACCESS_TOKEN_COOKIE_NAME, accessToken)
        await SecureStore.setItemAsync(
          EXPIRES_AT_COOKIE_NAME,
          expiresAt.toString(),
        )

        refreshTokenPromise = undefined

        return accessToken
      })
      .catch(async () => {
        await clearTokens()
        refreshTokenPromise = undefined

        return null
      })
  }

  return refreshTokenPromise
}

export const getAccessToken = async (): Promise<string | null> => {
  const token = await SecureStore.getItemAsync(ACCESS_TOKEN_COOKIE_NAME)
  const expiresAt = parseInt(
    (await SecureStore.getItemAsync(EXPIRES_AT_COOKIE_NAME)) ?? '0',
  )

  if (!token) {
    return null
  }

  if (Date.now() > expiresAt) {
    return refreshAccessToken()
  }

  return token
}

const AuthContext = React.createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: PropsWithChildren) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getAccessToken().then((token) => {
      setIsAuthenticated(!!token)
      setIsLoading(false)
    })
  }, [])

  const loginHandler = useCallback(async (tokens: TokenPayload) => {
    const expiresAt = Date.now() + tokens.expiresIn * 1000

    await SecureStore.setItemAsync(ACCESS_TOKEN_COOKIE_NAME, tokens.accessToken)
    await SecureStore.setItemAsync(
      REFRESH_TOKEN_COOKIE_NAME,
      tokens.refreshToken,
    )
    await SecureStore.setItemAsync(EXPIRES_AT_COOKIE_NAME, expiresAt.toString())

    setIsAuthenticated(true)
  }, [])

  const logoutHandler = useCallback(async () => {
    await clearTokens()
    setIsAuthenticated(false)
  }, [])

  // Register a logout callback so the network interceptor can trigger logout
  // when a token refresh fails (outside of React context).
  useEffect(() => {
    registerLogoutCallback(logoutHandler)
  }, [logoutHandler])

  const value = useMemo(
    () => ({ isAuthenticated, isLoading, loginHandler, logoutHandler }),
    [isAuthenticated, isLoading, loginHandler, logoutHandler],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = React.useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
