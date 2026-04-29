/**
 * Extracts the initials of a name.
 *
 * @param {string} name - The name from which to extract initials.
 * @returns {string} The initials of the name.
 */
export function getInitials(name: string | null | undefined): string {
  if (!name) {
    return '?'
  }

  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join('')
}
