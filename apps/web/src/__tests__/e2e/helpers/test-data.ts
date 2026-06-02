/**
 * Generates a test user object with a unique email address.
 *
 * @returns {Object} - The generated test user object.
 */
export function generateTestUser() {
  const id = Date.now().toString(36)

  return {
    name: 'Test User',
    email: `e2e-${id}@finiq.test`,
    password: 'Password123!',
  }
}

/**
 * Generates a test transaction object.
 *
 * @returns {Object} - The generated test transaction object.
 */
export function generateTestTransaction() {
  return {
    amount: 42.5,
    note: `E2E test transaction ${Date.now()}`,
    type: 'expense' as const,
    date: new Date().toISOString().split('T')[0]!,
  }
}

/**
 * Generates a test category object.
 *
 * @returns {Object} - The generated test category object.
 */
export function generateTestCategory() {
  const id = Date.now().toString(36)

  return {
    name: `E2E Category ${id}`,
    emoji: '🛒',
    color: '#3b82f6',
  }
}

/**
 * Generates a test budget object.
 *
 * @returns {Object} - The generated test budget object.
 */
export function generateTestBudget() {
  return {
    amount: 500,
  }
}

/**
 * Generates a test goal object.
 *
 * @returns {Object} - The generated test goal object.
 */
export function generateTestGoal() {
  const id = Date.now().toString(36)

  return {
    name: `E2E Goal ${id}`,
    emoji: '🎯',
    color: '#10b981',
    targetAmount: 10000,
    monthlyAmount: 500,
    targetDate: new Date(new Date().getFullYear() + 1, 0, 1)
      .toISOString()
      .split('T')[0],
  }
}
