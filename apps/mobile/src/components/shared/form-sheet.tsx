import { type PropsWithChildren } from 'react'
import { StyleSheet, View } from 'react-native'

import { BottomSheet } from '@/components/shared/bottom-sheet'

interface FormSheetProps extends PropsWithChildren {
  visible: boolean
  onClose: () => void
  title: string
}

export function FormSheet({
  visible,
  onClose,
  title,
  children,
}: FormSheetProps) {
  return (
    <BottomSheet visible={visible} onClose={onClose} title={title}>
      <View style={styles.content}>{children}</View>
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 12,
  },
})
