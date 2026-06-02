import { expect, test } from '@/__tests__/e2e/fixtures/auth'

test.describe('Statistics page', () => {
  test('should render the stats page', async ({ authedPage }) => {
    await authedPage.goto('/dashboard/stats')

    await expect(authedPage.getByTestId('stats-page-title')).toBeVisible({
      timeout: 10_000,
    })
  })

  test('should display the spending breakdown by category', async ({
    authedPage,
  }) => {
    await authedPage.goto('/dashboard/stats')

    await expect(
      authedPage.getByRole('tab', { name: /by category/i }),
    ).toBeVisible({
      timeout: 10_000,
    })
  })

  test('should switch between category and trend tabs', async ({
    authedPage,
  }) => {
    await authedPage.goto('/dashboard/stats')

    await expect(authedPage.getByTestId('stats-page-title')).toBeVisible({
      timeout: 10_000,
    })

    const trendTab = authedPage.getByRole('tab', { name: /6-month trend/i })
    await expect(trendTab).toBeVisible({ timeout: 10_000 })
    await trendTab.click()

    await expect(
      authedPage.getByRole('tab', { name: /6-month trend/i }),
    ).toHaveAttribute('data-state', 'active')
  })
})
