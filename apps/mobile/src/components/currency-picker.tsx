import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { CURRENCIES } from '@finiq/shared'
import { useThemeColor } from '@/hooks/use-theme-color'

interface CurrencyPickerProps {
  value: string
  onChange: (currency: string) => void
}

export function CurrencyPicker({ value, onChange }: CurrencyPickerProps) {
  const [open, setOpen] = useState(false)
  const surface = useThemeColor('surface')
  const border = useThemeColor('border')
  const text = useThemeColor('text')
  const primary = useThemeColor('primary')
  const insets = useSafeAreaInsets()

  return (
    <>
      <TouchableOpacity
        style={[
          styles.trigger,
          { borderColor: border, backgroundColor: surface },
        ]}
        onPress={() => setOpen(true)}
      >
        <Text style={{ color: text }}>{value}</Text>
        <Ionicons name="chevron-down" size={16} color={text} />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="slide">
        <View style={styles.overlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={() => setOpen(false)}
          />
          <View
            style={[
              styles.sheet,
              { backgroundColor: surface, paddingBottom: insets.bottom },
            ]}
          >
            <FlatList
              data={CURRENCIES}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.row, { borderBottomColor: border }]}
                  onPress={() => {
                    onChange(item.value)
                    setOpen(false)
                  }}
                >
                  <Text style={{ color: text }}>{item.label}</Text>
                  {item.value === value && (
                    <Ionicons name="checkmark" size={18} color={primary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '60%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
})
