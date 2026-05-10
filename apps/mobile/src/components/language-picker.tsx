import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useAvailableLanguages } from '@/hooks/data/use-available-languages'
import { useThemeColor } from '@/hooks/use-theme-color'
import { changeLanguage } from '@/i18n'

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'en',
  sr: 'sr',
}

const getLanguageName = (code: string) =>
  LANGUAGE_NAMES[code] ?? code.toUpperCase()

export function LanguagePicker() {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { data: languages = ['en'] } = useAvailableLanguages()

  const surface = useThemeColor('surface')
  const border = useThemeColor('border')
  const text = useThemeColor('text')
  const primary = useThemeColor('primary')
  const muted = useThemeColor('muted')
  const insets = useSafeAreaInsets()

  const currentLang = i18n.language

  const handleSelect = async (lang: string) => {
    if (lang === currentLang) {
      setOpen(false)
      return
    }

    setLoading(true)
    setOpen(false)

    try {
      await changeLanguage(lang)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <TouchableOpacity
        style={[
          styles.trigger,
          { borderColor: border, backgroundColor: surface },
        ]}
        onPress={() => setOpen(true)}
        disabled={loading}
        accessibilityRole="button"
        accessibilityLabel={`Language: ${getLanguageName(currentLang)}`}
        accessibilityState={{ disabled: loading }}
      >
        <Text style={{ color: text }}>{getLanguageName(currentLang)}</Text>
        {loading ? (
          <ActivityIndicator size="small" color={muted} />
        ) : (
          <Ionicons name="chevron-down" size={16} color={text} />
        )}
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
              data={languages}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.row, { borderBottomColor: border }]}
                  onPress={() => handleSelect(item)}
                  accessibilityRole="button"
                  accessibilityLabel={`Language: ${getLanguageName(item)}`}
                  accessibilityState={{ selected: item === currentLang }}
                >
                  <Text style={{ color: text }}>{getLanguageName(item)}</Text>
                  {item === currentLang && (
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
