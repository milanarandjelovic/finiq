import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, type Resolver } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import { categoryFormSchema, type CategoryFormValues } from '@finiq/schemas'
import { BottomSheet } from '@/components/shared/bottom-sheet'
import { AppTextInput } from '@/components/ui/app-text-input'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { useCategoryCreate } from '@/hooks/data/use-category-create'
import { useCategoryUpdate } from '@/hooks/data/use-category-update'
import { useTheme } from '@/hooks/use-theme'

const PRESET_COLORS = [
  '#6366f1',
  '#f43f5e',
  '#f59e0b',
  '#10b981',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
]

interface CategorySheetProps {
  visible: boolean
  onClose: () => void
  categoryId?: string
  defaultValues?: Partial<CategoryFormValues>
}

export function CategorySheet({
  visible,
  onClose,
  categoryId,
  defaultValues,
}: CategorySheetProps) {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const { mutate: create, isPending: creating } = useCategoryCreate()
  const { mutate: update, isPending: updating } = useCategoryUpdate()

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema) as Resolver<CategoryFormValues>,
    defaultValues: defaultValues ?? { color: PRESET_COLORS[0] },
  })

  const selectedColor = watch('color')

  useEffect(() => {
    if (visible) {
      reset(defaultValues ?? { color: PRESET_COLORS[0] })
    }
  }, [visible, defaultValues])

  const onSubmit = (values: CategoryFormValues) => {
    if (categoryId) {
      update(
        { id: categoryId, data: values },
        {
          onSuccess: () => {
            reset()
            onClose()
          },
        },
      )
    } else {
      create(values, {
        onSuccess: () => {
          reset()
          onClose()
        },
      })
    }
  }

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={
        categoryId ? t('categories.editCategory') : t('categories.newCategory')
      }
    >
      <View style={styles.content}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <FormField label={t('general.name')} error={errors.name?.message}>
              <AppTextInput
                value={field.value}
                onChangeText={field.onChange}
                placeholder={t('categories.namePlaceholder')}
                error={errors.name?.message}
              />
            </FormField>
          )}
        />

        <Controller
          name="emoji"
          control={control}
          render={({ field }) => (
            <FormField
              label={t('categories.emoji')}
              error={errors.emoji?.message}
            >
              <AppTextInput
                value={field.value}
                onChangeText={field.onChange}
                placeholder={t('categories.emojiPlaceholder')}
                error={errors.emoji?.message}
              />
            </FormField>
          )}
        />

        <FormField label={t('categories.color')}>
          <View style={styles.swatchRow}>
            {PRESET_COLORS.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => setValue('color', c)}
                style={[
                  styles.swatch,
                  { backgroundColor: c },
                  selectedColor === c && {
                    borderWidth: 3,
                    borderColor: colors.card,
                    opacity: 0.9,
                  },
                ]}
              />
            ))}
          </View>
        </FormField>

        <Controller
          name="budgetAmount"
          control={control}
          render={({ field }) => (
            <FormField
              label={`${t('categories.monthlyBudget')} (${t('general.optional')})`}
            >
              <AppTextInput
                value={field.value?.toString() ?? ''}
                onChangeText={(v) => field.onChange(parseFloat(v) || undefined)}
                keyboardType="decimal-pad"
                placeholder={t('categories.monthlyBudgetPlaceholder')}
              />
            </FormField>
          )}
        />

        <Button
          label={
            categoryId ? t('general.saveChanges') : t('categories.addCategory')
          }
          onPress={handleSubmit(onSubmit)}
          loading={creating || updating}
        />
      </View>
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 12,
  },
  swatchRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  swatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
})
