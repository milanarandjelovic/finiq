import { View as DefaultView, ViewProps } from 'react-native'

import { useThemeColor } from '@/hooks/use-theme-color'

export function View({ style, ...props }: ViewProps) {
  const backgroundColor = useThemeColor('background')

  return <DefaultView style={[{ backgroundColor }, style]} {...props} />
}
