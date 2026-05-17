import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import {
  categoryFormSchema,
  type CategoryFormInput,
  type CategoryFormValues,
} from '@finiq/schemas'
import { FormSheet } from '@/components/shared/form-sheet'
import { AppTextInput } from '@/components/ui/app-text-input'
import { Button } from '@/components/ui/button'
import {
  ColorPresetPicker,
  PRESET_COLORS,
} from '@/components/ui/color-preset-picker'
import { FormField } from '@/components/ui/form-field'
import { useCategoryCreate } from '@/hooks/data/use-category-create'
import { useCategoryUpdate } from '@/hooks/data/use-category-update'

interface CategorySheetProps {
  visible: boolean
  onClose: () => void
  categoryId?: string
  defaultValues?: Partial<CategoryFormValues>
}

const toFormInput = (
  values?: Partial<CategoryFormValues>,
): Partial<CategoryFormInput> =>
  values
    ? { ...values, budgetAmount: values.budgetAmount?.toString() }
    : { color: PRESET_COLORS[0] }

export function CategorySheet({
  visible,
  onClose,
  categoryId,
  defaultValues,
}: CategorySheetProps) {
  const { t } = useTranslation()
  const { mutate: create, isPending: creating } = useCategoryCreate()
  const { mutate: update, isPending: updating } = useCategoryUpdate()

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CategoryFormInput, unknown, CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema(t)),
    defaultValues: toFormInput(defaultValues),
  })

  const selectedColor = watch('color')

  useEffect(() => {
    if (visible) {
      reset(toFormInput(defaultValues))
    }
  }, [visible, defaultValues, reset])

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
    <FormSheet
      visible={visible}
      onClose={onClose}
      title={
        categoryId ? t('categories.editCategory') : t('categories.newCategory')
      }
    >
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
              placeholder="🛒"
              error={errors.emoji?.message}
            />
          </FormField>
        )}
      />

      <FormField label={t('categories.color')}>
        <ColorPresetPicker
          selected={selectedColor ?? PRESET_COLORS[0]}
          onSelect={(c) => setValue('color', c)}
        />
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
    </FormSheet>
  )
}
