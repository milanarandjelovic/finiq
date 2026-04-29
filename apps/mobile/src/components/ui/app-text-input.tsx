import { StyleSheet, TextInput, TextInputProps } from 'react-native'

import { useTheme } from '@/hooks/use-theme'

interface AppTextInputProps extends TextInputProps {
  error?: string
}

export function AppTextInput({ style, error, ...props }: AppTextInputProps) {
  const { colors } = useTheme()

  return (
    <TextInput
      placeholderTextColor={colors.mutedForeground}
      style={[
        styles.input,
        {
          borderColor: error ? colors.destructive : colors.border,
          backgroundColor: colors.card,
          color: colors.foreground,
        },
        style,
      ]}
      {...props}
    />
  )
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
  },
})
