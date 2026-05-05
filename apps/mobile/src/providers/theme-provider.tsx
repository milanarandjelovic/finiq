import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import * as SecureStore from 'expo-secure-store'
import { useColorScheme } from 'react-native'

import { THEME_COOKIE_NAME } from '@finiq/shared'

export type ThemePreference = 'light' | 'dark' | 'system'
export type ColorScheme = 'light' | 'dark'

interface ThemeContextValue {
  preference: ThemePreference
  colorScheme: ColorScheme
  isDark: boolean
  setPreference: (pref: ThemePreference) => void
  cycleTheme: () => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: PropsWithChildren) {
  const systemScheme = (useColorScheme() ?? 'light') as ColorScheme
  const [preference, setPreferenceState] = useState<ThemePreference>('system')

  useEffect(() => {
    SecureStore.getItemAsync(THEME_COOKIE_NAME).then((stored) => {
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        setPreferenceState(stored)
      }
    })
  }, [])

  const colorScheme: ColorScheme =
    preference === 'system' ? systemScheme : preference

  const setPreference = useCallback((pref: ThemePreference) => {
    setPreferenceState(pref)
    SecureStore.setItemAsync(THEME_COOKIE_NAME, pref)
  }, [])

  const cycleTheme = useCallback(() => {
    const order: ThemePreference[] = ['light', 'dark', 'system']
    const next = order[(order.indexOf(preference) + 1) % order.length]
    setPreference(next)
  }, [preference, setPreference])

  const toggleTheme = useCallback(() => {
    setPreference(colorScheme === 'light' ? 'dark' : 'light')
  }, [colorScheme, setPreference])

  return (
    <ThemeContext.Provider
      value={{
        preference,
        colorScheme,
        isDark: colorScheme === 'dark',
        setPreference,
        cycleTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext)

  if (!ctx) {
    throw new Error('useThemeContext must be used within <ThemeProvider>')
  }
  return ctx
}
