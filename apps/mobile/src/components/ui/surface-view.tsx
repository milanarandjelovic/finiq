import { View as DefaultView, ViewProps } from 'react-native'

import { useThemeColor } from '@/hooks/use-theme-color'

export function SurfaceView({ style, ...props }: ViewProps) {
  const backgroundColor = useThemeColor('surface')

  return <DefaultView style={[{ backgroundColor }, style]} {...props} />
}
