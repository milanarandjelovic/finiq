import Colors from '@/constants/colors'
import { useThemeContext } from '@/providers/theme-provider'

export type ThemeColorKey = keyof typeof Colors.light

export const useThemeColor = (colorKey: ThemeColorKey): string => {
  const { colorScheme } = useThemeContext()

  return Colors[colorScheme][colorKey]
}
