import Colors from '@/constants/colors'
import { radius, spacing } from '@/constants/theme'
import { useThemeContext } from '@/providers/theme-provider'

export const useTheme = () => {
  const {
    colorScheme,
    isDark,
    preference,
    setPreference,
    cycleTheme,
    toggleTheme,
  } = useThemeContext()

  return {
    colors: Colors[colorScheme],
    spacing,
    radius,
    scheme: colorScheme,
    isDark,
    preference,
    setPreference,
    cycleTheme,
    toggleTheme,
  } as const
}
