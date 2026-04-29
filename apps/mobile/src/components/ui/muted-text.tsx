import { Text as DefaultText, TextProps } from 'react-native'

import { useThemeColor } from '@/hooks/use-theme-color'

export function MutedText({ style, ...props }: TextProps) {
  const color = useThemeColor('muted')

  return <DefaultText style={[{ color }, style]} {...props} />
}
