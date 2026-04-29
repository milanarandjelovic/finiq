import { Text as DefaultText, TextProps } from 'react-native'

import { useThemeColor } from '@/hooks/use-theme-color'

export function PrimaryText({ style, ...props }: TextProps) {
  const color = useThemeColor('primary')

  return <DefaultText style={[{ color }, style]} {...props} />
}
