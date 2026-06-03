import { expect, test } from '@/__tests__/e2e/fixtures/auth'

test.describe('Forgot password page', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies()
    await page.goto('/auth/forgot-password')
  })

  test('should render the forgot password form', async ({ page }) => {
    await expect(page.getByText('Forgot password?')).toBeVisible()

    await expect(page.getByTestId('forgot-password-email')).toBeVisible()
    await expect(page.getByTestId('forgot-password-submit')).toBeVisible()
    await expect(page.getByTestId('forgot-password-back')).toBeVisible()
  })

  test('should show validation for invalid email', async ({ page }) => {
    await page.getByTestId('forgot-password-email').fill('')
    await page.getByTestId('forgot-password-submit').click()

    await expect(page.getByText(/valid email/i)).toBeVisible()
  })

  test('should show success state after submitting valid email', async ({
    page,
    testUser,
  }) => {
    await page.getByTestId('forgot-password-email').fill(testUser.email)
    await page.getByTestId('forgot-password-submit').click()

    await expect(page.getByText(/check your email/i)).toBeVisible()
    await expect(page.getByText(testUser.email)).toBeVisible()
  })

  test('should allow navigating back to sign in', async ({ page }) => {
    await page.getByTestId('forgot-password-back').click()

    await expect(page).toHaveURL('/auth/login')
  })
})
