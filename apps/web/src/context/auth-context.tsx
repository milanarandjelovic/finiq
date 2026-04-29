'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import type { ReactNode } from 'react'

import {
  clearAccessToken,
  clearRefreshToken,
  getAccessToken,
  setAccessToken,
  setRefreshToken,
} from '@/lib/cookies'

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthContextValue extends AuthState {
  login: (accessToken: string, refreshToken: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    const token = getAccessToken()
    setState({ isAuthenticated: !!token, isLoading: false })
  }, [])

  const login = useCallback((accessToken: string, refreshToken: string) => {
    setAccessToken(accessToken)
    setRefreshToken(refreshToken)
    setState({ isAuthenticated: true, isLoading: false })
  }, [])

  const logout = useCallback(() => {
    clearAccessToken()
    clearRefreshToken()
    setState({ isAuthenticated: false, isLoading: false })
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
