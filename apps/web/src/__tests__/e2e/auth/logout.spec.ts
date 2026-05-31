import { expect, test } from '@/__tests__/e2e/fixtures/auth'

test.describe('Logout', () => {
  test('should log out from the sidebar user menu', async ({ authedPage }) => {
    await authedPage.getByTestId('user-menu-trigger').click()
    await authedPage.getByTestId('user-menu-sign-out').click()
    await authedPage.waitForURL('/auth/login')

    await expect(authedPage.getByText('Welcome back')).toBeVisible()
  })

  test('should clear auth tokens on logout', async ({ authedPage }) => {
    await authedPage.getByTestId('user-menu-trigger').click()
    await authedPage.getByTestId('user-menu-sign-out').click()
    await authedPage.waitForURL('/auth/login')

    await authedPage.goto('/dashboard', { waitUntil: 'commit' })
    await authedPage.waitForURL('/auth/login')
  })
})
