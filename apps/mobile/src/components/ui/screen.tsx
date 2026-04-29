import { ViewProps } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useThemeColor } from '@/hooks/use-theme-color'

export function Screen({ style, ...props }: ViewProps) {
  const backgroundColor = useThemeColor('background')

  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor }, style]} {...props} />
  )
}
