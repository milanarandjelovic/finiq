import { StyleSheet } from 'react-native'

import { Text } from '@/components/ui/text'
import { useTheme } from '@/hooks/use-theme'

export function CategorySectionHeader({ title }: { title: string }) {
  const { colors } = useTheme()

  return (
    <Text style={[styles.sectionHeader, { color: colors.mutedForeground }]}>
      {title}
    </Text>
  )
}

const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingVertical: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
})
