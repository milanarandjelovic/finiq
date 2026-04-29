import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, type Resolver } from 'react-hook-form'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import { goalFormSchema, type GoalFormValues } from '@finiq/schemas'
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

interface GoalSheetProps {
  visible: boolean
  onClose: () => void
  goalId?: string
  defaultValues?: Partial<GoalFormValues>
}

export function GoalSheet({
  visible,
  onClose,
  goalId,
  defaultValues,
}: GoalSheetProps) {
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
  } = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema) as Resolver<GoalFormValues>,
    defaultValues: defaultValues ?? { color: PRESET_COLORS[0] },
  })

  const selectedColor = watch('color')

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
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={goalId ? 'Edit Goal' : 'New Goal'}
    >
      <View style={styles.content}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <FormField label="Name" error={errors.name?.message}>
              <AppTextInput
                value={field.value}
                onChangeText={field.onChange}
                placeholder="e.g. Emergency Fund"
                error={errors.name?.message}
              />
            </FormField>
          )}
        />

        <Controller
          name="emoji"
          control={control}
          render={({ field }) => (
            <FormField label="Emoji" error={errors.emoji?.message}>
              <AppTextInput
                value={field.value}
                onChangeText={field.onChange}
                placeholder="🎯"
                error={errors.emoji?.message}
              />
            </FormField>
          )}
        />

        <FormField label="Color">
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
          name="targetAmount"
          control={control}
          render={({ field }) => (
            <FormField
              label="Target amount"
              error={errors.targetAmount?.message}
            >
              <AppTextInput
                value={field.value?.toString() ?? ''}
                onChangeText={(v) => field.onChange(parseFloat(v) || 0)}
                keyboardType="decimal-pad"
                placeholder="0.00"
                error={errors.targetAmount?.message}
              />
            </FormField>
          )}
        />

        <Controller
          name="targetDate"
          control={control}
          render={({ field }) => (
            <FormField label="Target date (optional, YYYY-MM-DD)">
              <AppTextInput
                value={field.value ?? ''}
                onChangeText={field.onChange}
                placeholder="2025-12-31"
              />
            </FormField>
          )}
        />

        <Button
          label={goalId ? 'Save changes' : 'Create goal'}
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
