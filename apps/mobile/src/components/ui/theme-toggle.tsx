import { Moon, Sun, SunMoon } from 'lucide-react-native'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import { useTheme } from '@/hooks/use-theme'
import type { ThemePreference } from '@/providers/theme-provider'

interface ThemeToggleProps {
  /** 'icon' shows a single pressable icon that cycles through all three modes.
   *  'segmented' shows a three-segment control (light / system / dark).
   *  Defaults to 'icon'. */
  variant?: 'icon' | 'segmented'
  size?: number
}

const ICON_SIZE = 20

const icons: Record<ThemePreference, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: SunMoon,
}

export function ThemeToggle({
  variant = 'icon',
  size = ICON_SIZE,
}: ThemeToggleProps) {
  const {
    preference,
    scheme: colorScheme,
    colors,
    cycleTheme,
    setPreference,
  } = useTheme()

  if (variant === 'segmented') {
    const segments: ThemePreference[] = ['light', 'system', 'dark']

    return (
      <View
        style={[
          styles.segmented,
          { backgroundColor: colors.secondary, borderColor: colors.border },
        ]}
      >
        {segments.map((seg) => {
          const Icon = icons[seg]
          const isActive = preference === seg

          return (
            <TouchableOpacity
              key={seg}
              onPress={() => setPreference(seg)}
              style={[
                styles.segment,
                isActive && {
                  backgroundColor: colors.card,
                  borderRadius: 6,
                },
              ]}
              hitSlop={4}
            >
              <Icon
                size={size}
                color={isActive ? colors.foreground : colors.mutedForeground}
                strokeWidth={1.75}
              />
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  // Icon variant - a single button that cycles through modes
  const Icon = icons[preference]
  const iconColor =
    colorScheme === 'dark' ? colors.foreground : colors.foreground

  return (
    <TouchableOpacity
      onPress={cycleTheme}
      hitSlop={8}
      style={styles.iconButton}
      accessibilityLabel={`Current theme: ${preference}. Tap to change.`}
      accessibilityRole="button"
    >
      <Icon size={size} color={iconColor} strokeWidth={1.75} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  iconButton: {
    padding: 4,
  },
  segmented: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 3,
    gap: 2,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
})
