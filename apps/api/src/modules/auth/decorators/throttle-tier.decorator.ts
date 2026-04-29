import { SetMetadata } from '@nestjs/common'

export type ThrottleTierType = 'global' | 'auth' | 'sensitive'

export const THROTTLE_TIER_KEY = 'throttle_tier'

export const ThrottleTier = (tier: ThrottleTierType) =>
  SetMetadata(THROTTLE_TIER_KEY, tier)
