import { expect, test } from '@playwright/test'

test.describe('Protected routes', () => {
  for (const path of [
    '/dashboard',
    '/dashboard/transactions',
    '/dashboard/budget',
    '/dashboard/categories',
    '/dashboard/goals',
    '/dashboard/stats',
    '/dashboard/profile',
    '/dashboard/settings',
  ]) {
    test(`should redirect to login when accessing ${path}`, async ({
      page,
    }) => {
      await page.context().clearCookies()
      await page.goto(path, { waitUntil: 'commit' })
      await page.waitForURL('/auth/login')
    })
  }

  for (const path of [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
  ]) {
    test(`should not redirect from auth page: ${path}`, async ({ page }) => {
      await page.goto(path)

      await expect(page).toHaveURL(path)
    })
  }
})
