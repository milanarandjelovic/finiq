/**
 * Parse comma separated values into an array.
 *
 * @param {string} value
 * @returns string[]
 */
export function parseCommaSeparatedValues(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item !== '')
}
