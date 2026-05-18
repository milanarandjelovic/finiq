import { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import { format, parseISO } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { Platform, Pressable, StyleSheet } from 'react-native'

import { Text } from '@/components/ui/text'
import { useTheme } from '@/hooks/use-theme'

interface DateInputProps {
  value?: string // YYYY-MM-DD
  onChange: (value: string) => void
  placeholder?: string
}

export function DateInput({ value, onChange, placeholder }: DateInputProps) {
  const { t } = useTranslation()
  const { colors, isDark } = useTheme()
  const [open, setOpen] = useState(false)

  const date = value ? parseISO(value) : new Date()
  const displayValue = value ? format(parseISO(value), 'dd.MM.yyyy') : null
  const resolvedPlaceholder = placeholder ?? t('general.selectDate')

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={[
          styles.input,
          {
            borderColor: colors.border,
            backgroundColor: colors.card,
          },
        ]}
      >
        <Text
          style={[
            styles.text,
            !displayValue && { color: colors.mutedForeground },
          ]}
        >
          {displayValue ?? resolvedPlaceholder}
        </Text>
      </Pressable>

      {open && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          themeVariant={isDark ? 'dark' : 'light'}
          onChange={(_, selected) => {
            setOpen(Platform.OS === 'ios')
            if (selected) {
              onChange(format(selected, 'yyyy-MM-dd'))
            }
            if (Platform.OS === 'android') {
              setOpen(false)
            }
          }}
        />
      )}
    </>
  )
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  text: {
    fontSize: 15,
  },
})
