import { darkColors, lightColors } from '@/constants/theme'

const Colors = {
  light: {
    ...lightColors,
    text: lightColors.foreground,
    surface: lightColors.card,
    muted: lightColors.mutedForeground,
    income: lightColors.success,
    expense: lightColors.destructive,
  },
  dark: {
    ...darkColors,
    text: darkColors.foreground,
    surface: darkColors.card,
    muted: darkColors.mutedForeground,
    income: darkColors.success,
    expense: darkColors.destructive,
  },
} as const

export default Colors
