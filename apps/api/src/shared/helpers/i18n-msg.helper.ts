import type { TranslationKey } from '@finiq/translations'
import { i18nValidationMessage } from 'nestjs-i18n'

/**
 * Type-safe wrapper for i18nValidationMessage.
 * Pins the generic to Record<string, unknown> to avoid TypeScript inferring
 * K = never from the string literal, while enforcing TranslationKey at call sites.
 */
export const i18nMsg = (key: TranslationKey) =>
  i18nValidationMessage<Record<string, unknown>>(key as string)
