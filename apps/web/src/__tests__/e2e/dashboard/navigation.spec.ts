import { expect, test } from '@/__tests__/e2e/fixtures/auth'

test.describe('Dashboard navigation', () => {
  const navLinks = [
    { label: /dashboard/i, path: '/dashboard' },
    { label: /transactions/i, path: '/dashboard/transactions' },
    { label: /budget/i, path: '/dashboard/budget' },
    { label: /categories/i, path: '/dashboard/categories' },
    { label: /goals/i, path: '/dashboard/goals' },
    { label: /statistics|stats/i, path: '/dashboard/stats' },
  ]

  for (const link of navLinks) {
    test(`should navigate to ${link.path} via sidebar`, async ({
      authedPage,
    }) => {
      await authedPage.getByRole('link', { name: link.label }).click()
      await authedPage.waitForURL(link.path)
    })
  }

  test('should highlight the active navigation item', async ({
    authedPage,
  }) => {
    await authedPage.goto('/dashboard/budget')
    const budgetLink = authedPage.getByRole('link', { name: /budget/i })

    await expect(budgetLink).toHaveAttribute('data-active', 'true')
  })

  test('should update the breadcrumb on navigation', async ({ authedPage }) => {
    await authedPage.goto('/dashboard')
    await expect(
      authedPage.locator('header').getByRole('heading', { name: /dashboard/i }),
    ).toBeVisible()

    await authedPage.goto('/dashboard/settings')
    await expect(
      authedPage.locator('header').getByRole('heading', { name: /settings/i }),
    ).toBeVisible()
  })

  test('should navigate to settings from header user menu', async ({
    authedPage,
  }) => {
    await authedPage.goto('/dashboard')

    await authedPage.getByTestId('user-menu-trigger').click()
    await authedPage.getByTestId('header-settings-link').click()
    await authedPage.waitForURL('/dashboard/settings')
  })

  test('should navigate to profile from header user menu', async ({
    authedPage,
  }) => {
    await authedPage.goto('/dashboard')
    await authedPage.getByTestId('user-menu-trigger').click()
    await authedPage.getByTestId('header-profile-link').click()
    await authedPage.waitForURL('/dashboard/profile')
  })
})
