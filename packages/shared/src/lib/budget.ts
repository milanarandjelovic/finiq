/**
 * Calculate the progress percentage.
 *
 * @param {number} value - The current value.
 * @param {number} total - The total value.
 * @returns {number} The progress percentage, capped at 100%.
 */
export function calculateProgress(value: number, total: number): number {
  return total > 0 ? Math.min(100, (value / total) * 100) : 0
}

/**
 * Check if the budget is overspent.
 *
 * @param {number} spent - The amount spent.
 * @param {number} budgeted - The budgeted amount.
 * @returns {boolean} True if the budget is overspent, false otherwise.
 */
export function isOverBudget(spent: number, budgeted: number): boolean {
  return spent > budgeted && budgeted > 0
}
