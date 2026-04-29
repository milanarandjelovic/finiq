import { StyleSheet, Text, View } from 'react-native'

import { useTheme } from '@/hooks/use-theme'

type BadgeVariant = 'default' | 'destructive' | 'secondary'

interface BadgeProps {
  label: string
  variant?: BadgeVariant
}

export function Badge({ label, variant = 'default' }: BadgeProps) {
  const { colors } = useTheme()

  const variantColors: Record<BadgeVariant, { bg: string; text: string }> = {
    default: { bg: colors.primary + '20', text: colors.primary },
    destructive: { bg: colors.destructive + '20', text: colors.destructive },
    secondary: {
      bg: colors.mutedForeground + '20',
      text: colors.mutedForeground,
    },
  }

  const { bg, text } = variantColors[variant]

  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color: text }]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  pill: { borderRadius: 99, paddingHorizontal: 8, paddingVertical: 2 },
  text: { fontSize: 11, fontWeight: '600' },
})
