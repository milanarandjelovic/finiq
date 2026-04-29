import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function to merge class names using clsx and tailwind-merge.
 *
 * @param {...ClassValue[]} inputs - Class names to be merged.
 * @returns {string} - Merged class names as a string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
