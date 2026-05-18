import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import {
  goalFormSchema,
  type GoalFormInput,
  type GoalFormValues,
} from '@finiq/schemas'
import { FormSheet } from '@/components/shared/form-sheet'
import { AppTextInput } from '@/components/ui/app-text-input'
import { Button } from '@/components/ui/button'
import {
  ColorPresetPicker,
  PRESET_COLORS,
} from '@/components/ui/color-preset-picker'
import { DateInput } from '@/components/ui/date-input'
import { FormField } from '@/components/ui/form-field'
import { useCategoryCreate } from '@/hooks/data/use-category-create'
import { useCategoryUpdate } from '@/hooks/data/use-category-update'

interface GoalSheetProps {
  visible: boolean
  onClose: () => void
  goalId?: string
  defaultValues?: Partial<GoalFormValues>
}

const toFormInput = (
  values?: Partial<GoalFormValues>,
): Partial<GoalFormInput> =>
  values
    ? {
        ...values,
        targetAmount: values.targetAmount?.toString(),
        budgetAmount: values.budgetAmount?.toString(),
      }
    : { color: PRESET_COLORS[0] }

export function GoalSheet({
  visible,
  onClose,
  goalId,
  defaultValues,
}: GoalSheetProps) {
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
  } = useForm<GoalFormInput, unknown, GoalFormValues>({
    resolver: zodResolver(goalFormSchema(t)),
    defaultValues: toFormInput(defaultValues),
  })

  const selectedColor = watch('color')

  useEffect(() => {
    if (visible) {
      reset(toFormInput(defaultValues))
    }
  }, [visible, defaultValues, reset])

  const onSubmit = (values: GoalFormValues) => {
    const payload = { ...values, isGoal: true }
    if (goalId) {
      update(
        { id: goalId, data: payload },
        {
          onSuccess: () => {
            reset()
            onClose()
          },
        },
      )
    } else {
      create(payload, {
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
      title={goalId ? t('goals.editGoal') : t('goals.newGoal')}
    >
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <FormField label={t('general.name')} error={errors.name?.message}>
            <AppTextInput
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('goals.goalNamePlaceholder')}
              error={errors.name?.message}
            />
          </FormField>
        )}
      />

      <Controller
        name="emoji"
        control={control}
        render={({ field }) => (
          <FormField label={t('goals.emoji')} error={errors.emoji?.message}>
            <AppTextInput
              value={field.value}
              onChangeText={field.onChange}
              placeholder="🎯"
              error={errors.emoji?.message}
            />
          </FormField>
        )}
      />

      <FormField label={t('goals.color')}>
        <ColorPresetPicker
          selected={selectedColor ?? PRESET_COLORS[0]}
          onSelect={(c) => setValue('color', c)}
        />
      </FormField>

      <Controller
        name="targetAmount"
        control={control}
        render={({ field }) => (
          <FormField
            label={t('goals.targetAmount')}
            error={errors.targetAmount?.message}
          >
            <AppTextInput
              value={field.value?.toString() ?? ''}
              onChangeText={(v) => field.onChange(parseFloat(v) || 0)}
              keyboardType="decimal-pad"
              placeholder={t('goals.targetAmountPlaceholder')}
              error={errors.targetAmount?.message}
            />
          </FormField>
        )}
      />

      <Controller
        name="targetDate"
        control={control}
        render={({ field }) => (
          <FormField label={t('goals.targetDate')}>
            <DateInput
              value={field.value}
              onChange={field.onChange}
              placeholder={t('goals.pickADate')}
            />
          </FormField>
        )}
      />

      <Button
        label={goalId ? t('general.saveChanges') : t('goals.newGoal')}
        onPress={handleSubmit(onSubmit)}
        loading={creating || updating}
      />
    </FormSheet>
  )
}
