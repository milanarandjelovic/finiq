import { expect, test } from '@playwright/test'

test.describe('Reset password page', () => {
  test('should render the reset password form when token is present', async ({
    page,
  }) => {
    await page.goto('/auth/reset-password?token=valid-test-token')

    await expect(page.getByText('Set new password')).toBeVisible()
    await expect(page.getByTestId('reset-password-email')).toBeVisible()
    await expect(page.getByTestId('reset-password-password')).toBeVisible()
    await expect(
      page.getByTestId('reset-password-confirm-password'),
    ).toBeVisible()
    await expect(page.getByTestId('reset-password-submit')).toBeVisible()
  })

  test('should show validation errors for empty fields', async ({ page }) => {
    await page.goto('/auth/reset-password?token=valid-test-token')
    await page.getByTestId('reset-password-submit').click()

    await expect(page.getByText(/valid email/i)).toBeVisible()
  })

  test('should show error when passwords do not match', async ({ page }) => {
    await page.goto('/auth/reset-password?token=valid-test-token')
    await page.getByTestId('reset-password-email').fill('e2e@finiq.test')
    await page.getByTestId('reset-password-password').fill('NewPass123!')
    await page
      .getByTestId('reset-password-confirm-password')
      .fill('DifferentPass1!')
    await page.getByTestId('reset-password-submit').click()

    await expect(page.getByText(/must match/i)).toBeVisible()
  })

  test('should show error for invalid or expired token', async ({ page }) => {
    await page.goto('/auth/reset-password?token=invalid-token-e2e')
    await page.getByTestId('reset-password-email').fill('e2e@finiq.test')
    await page.getByTestId('reset-password-password').fill('NewPass123!')
    await page
      .getByTestId('reset-password-confirm-password')
      .fill('NewPass123!')
    await page.getByTestId('reset-password-submit').click()

    await expect(
      page.getByText(/not valid|invalid|expired|not found|isn't associated/i),
    ).toBeVisible()
  })

  test('should navigate back to sign in', async ({ page }) => {
    await page.goto('/auth/reset-password?token=test-token')
    await page.getByTestId('reset-password-back').click()

    await expect(page).toHaveURL('/auth/login')
  })
})
