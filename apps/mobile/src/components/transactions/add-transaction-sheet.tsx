import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import {
  transactionFormSchema,
  type TransactionFormInput,
  type TransactionFormValues,
} from '@finiq/schemas'
import { FormSheet } from '@/components/shared/form-sheet'
import { AppTextInput } from '@/components/ui/app-text-input'
import { Button } from '@/components/ui/button'
import { DateInput } from '@/components/ui/date-input'
import { FormField } from '@/components/ui/form-field'
import { useTransactionCreate } from '@/hooks/data/use-transaction-create'
import { useTheme } from '@/hooks/use-theme'
import type { Category } from '@/types/category'

interface AddTransactionSheetProps {
  visible: boolean
  onClose: () => void
  categories: Category[]
}

export function AddTransactionSheet({
  visible,
  onClose,
  categories,
}: AddTransactionSheetProps) {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const { mutate, isPending } = useTransactionCreate()
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<TransactionFormInput, unknown, TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema(t)),
  })

  const type = watch('type')

  const onSubmit = (values: TransactionFormValues) => {
    mutate(values, {
      onSuccess: () => {
        reset()
        onClose()
      },
      onError: () =>
        Alert.alert(t('general.error'), t('transactions.failedToAdd')),
    })
  }

  return (
    <FormSheet
      visible={visible}
      onClose={onClose}
      title={t('transactions.addTransaction')}
    >
      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <View style={styles.typeRow}>
            {(
              [
                { value: 'income', label: t('transactions.income') },
                { value: 'expense', label: t('transactions.expense') },
              ] as const
            ).map((opt) => (
              <Button
                key={opt.value}
                label={opt.label}
                variant={field.value === opt.value ? 'primary' : 'outline'}
                onPress={() => field.onChange(opt.value)}
                size="sm"
              />
            ))}
          </View>
        )}
      />

      <Controller
        name="amount"
        control={control}
        render={({ field }) => (
          <FormField
            label={t('transactions.amount')}
            error={errors.amount?.message}
          >
            <AppTextInput
              value={field.value?.toString()}
              onChangeText={(v) => field.onChange(parseFloat(v) || 0)}
              keyboardType="decimal-pad"
              placeholder={t('transactions.amountPlaceholder')}
              error={errors.amount?.message}
            />
          </FormField>
        )}
      />

      <Controller
        name="date"
        control={control}
        render={({ field }) => (
          <FormField
            label={t('transactions.date')}
            error={errors.date?.message}
          >
            <DateInput value={field.value} onChange={field.onChange} />
          </FormField>
        )}
      />

      {type === 'expense' && (
        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <FormField label={t('transactions.category')}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.chipRow}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      onPress={() => field.onChange(cat.id)}
                      accessibilityRole="button"
                      accessibilityLabel={`${cat.emoji} ${cat.name}`}
                      accessibilityState={{ selected: field.value === cat.id }}
                      style={[
                        styles.catChip,
                        { borderColor: colors.border },
                        field.value === cat.id && {
                          backgroundColor: colors.primary + '20',
                          borderColor: colors.primary,
                        },
                      ]}
                    >
                      <Text>
                        {cat.emoji} {cat.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </FormField>
          )}
        />
      )}

      <Controller
        name="note"
        control={control}
        render={({ field }) => (
          <FormField label={t('transactions.noteOptionalLabel')}>
            <AppTextInput
              value={field.value ?? ''}
              onChangeText={field.onChange}
              placeholder={t('transactions.notePlaceholder')}
            />
          </FormField>
        )}
      />

      <Button
        label={t('transactions.addTransaction')}
        onPress={handleSubmit(onSubmit)}
        loading={isPending}
      />
    </FormSheet>
  )
}

const styles = StyleSheet.create({
  typeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  catChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
})
