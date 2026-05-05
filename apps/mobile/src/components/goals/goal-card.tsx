import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { StyleSheet, TouchableOpacity } from 'react-native'

import { calculateProgress } from '@finiq/shared'
import { Badge } from '@/components/ui/badge'
import { MutedText } from '@/components/ui/muted-text'
import { ProgressBar } from '@/components/ui/progress-bar'
import { SurfaceView } from '@/components/ui/surface-view'
import { Text } from '@/components/ui/text'
import { View } from '@/components/ui/view'
import type { Category } from '@/types/category'

export function GoalCard({
  goal,
  saved,
  onEdit,
  onDelete,
  format,
}: {
  goal: Category
  saved: number
  onEdit: () => void
  onDelete: () => void
  format: (amount: number) => string
}) {
  const { t } = useTranslation()
  const target = goal.targetAmount ?? 0
  const progress = calculateProgress(saved, target)

  return (
    <SurfaceView style={styles.card}>
      <View style={[styles.cardHeader, { backgroundColor: 'transparent' }]}>
        <Text style={styles.cardEmoji}>{goal.emoji}</Text>
        <Text style={styles.cardName}>{goal.name}</Text>
        <TouchableOpacity onPress={onEdit} hitSlop={8}>
          <Ionicons name="pencil-outline" size={18} color="#71717a" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} hitSlop={8}>
          <Ionicons name="trash-outline" size={18} color="#71717a" />
        </TouchableOpacity>
      </View>

      <ProgressBar value={progress} color={goal.color} height={8} />

      <View style={[styles.amounts, { backgroundColor: 'transparent' }]}>
        <MutedText>
          {format(saved)} {t('goals.saved')}
        </MutedText>
        <MutedText>
          {t('goals.of')} {format(target)}
        </MutedText>
      </View>

      <View style={[styles.footer, { backgroundColor: 'transparent' }]}>
        <Badge label={`${Math.round(progress)}${t('goals.percentComplete')}`} />
        {goal.targetDate && (
          <MutedText style={styles.targetDate}>
            {t('goals.due')} {goal.targetDate}
          </MutedText>
        )}
      </View>
    </SurfaceView>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardEmoji: {
    fontSize: 24,
  },
  cardName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  amounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  targetDate: {
    fontSize: 12,
  },
})
