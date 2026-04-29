import { Text as DefaultText, TextProps } from 'react-native'

import { useThemeColor } from '@/hooks/use-theme-color'

export function Text({ style, ...props }: TextProps) {
  const color = useThemeColor('text')

  return <DefaultText style={[{ color }, style]} {...props} />
}
