import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native'

import { useTheme } from '@/hooks/use-theme'

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'destructive'
type ButtonSize = 'sm' | 'md'

interface ButtonProps {
  label: string
  onPress: () => void
  variant?: ButtonVariant
  loading?: boolean
  disabled?: boolean
  size?: ButtonSize
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  size = 'md',
}: ButtonProps) {
  const { colors } = useTheme()

  const bgColor =
    variant === 'primary'
      ? colors.primary
      : variant === 'destructive'
        ? colors.destructive
        : 'transparent'

  const labelColor =
    variant === 'primary'
      ? colors.primaryForeground
      : variant === 'destructive'
        ? colors.destructiveForeground
        : colors.foreground

  const paddingVertical = size === 'sm' ? 8 : 14

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        { backgroundColor: bgColor, paddingVertical },
        variant === 'outline' && {
          borderWidth: 1,
          borderColor: colors.border,
        },
        (disabled || loading) && { opacity: 0.5 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={labelColor} />
      ) : (
        <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  base: { borderRadius: 8, alignItems: 'center', paddingHorizontal: 16 },
  label: { fontWeight: '600', fontSize: 15 },
})
