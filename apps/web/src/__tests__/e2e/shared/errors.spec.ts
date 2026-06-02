import type { Route } from '@playwright/test'

import { expect, test } from '@/__tests__/e2e/fixtures/auth'

test.describe('Error handling', () => {
  test('should show appropriate response for unknown routes', async ({
    page,
  }) => {
    const response = await page.goto('/nonexistent-route')

    expect(response?.status()).toBe(404)
  })

  test('should handle invalid URL parameters gracefully', async ({
    authedPage,
  }) => {
    await authedPage.goto('/dashboard/transactions?page=-1')

    await expect(authedPage.locator('table')).toBeVisible({ timeout: 10_000 })
  })

  test('should show the query error component on API failure', async ({
    authedPage,
  }) => {
    await authedPage.route(/localhost:4000/, (route) => route.abort())
    await authedPage.goto('/dashboard')

    await expect(authedPage.getByTestId('query-error-message')).toBeVisible({
      timeout: 15_000,
    })
  })

  test('should allow retrying a failed query', async ({ authedPage }) => {
    const abortHandler = (route: Route) => route.abort()

    await authedPage.route(/localhost:4000/, abortHandler)
    await authedPage.goto('/dashboard')

    await expect(authedPage.getByTestId('query-error-retry')).toBeVisible({
      timeout: 15_000,
    })

    await authedPage.unroute(/localhost:4000/, abortHandler)
    await authedPage.getByTestId('query-error-retry').click()

    await expect(
      authedPage.getByTestId('dashboard-overview-heading'),
    ).toBeVisible({
      timeout: 15_000,
    })
  })

  test('should show empty states when no data exists', async ({
    authedPage,
  }) => {
    // New test user has no transactions — real API returns empty list
    await authedPage.goto('/dashboard/transactions')

    await expect(authedPage.getByText('No results.')).toBeVisible({
      timeout: 10_000,
    })
  })
})
