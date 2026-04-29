import { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'

import { useThemeColor } from '@/hooks/use-theme-color'

function SkeletonRow() {
  const surface = useThemeColor('surface')
  const border = useThemeColor('border')
  const opacity = useSharedValue(1)

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.4, { duration: 800 }), -1, true)
  }, [opacity])

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))

  return (
    <Animated.View
      style={[
        animStyle,
        styles.row,
        { backgroundColor: surface, borderColor: border },
      ]}
    />
  )
}

export function LoadingState({ count = 4 }: { count?: number }) {
  return (
    <View style={styles.wrapper}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonRow key={i} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    gap: 10,
  },
  row: {
    height: 60,
    borderRadius: 10,
    borderWidth: 1,
  },
})
