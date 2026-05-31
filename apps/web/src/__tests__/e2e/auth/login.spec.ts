import { expect, test } from '@/__tests__/e2e/fixtures/auth'

test.describe('Login page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login')
  })

  test('should render the login page with all elements', async ({ page }) => {
    await expect(page.getByText('Welcome back')).toBeVisible()
    await expect(page.getByTestId('login-email')).toBeVisible()
    await expect(page.getByTestId('login-password')).toBeVisible()
    await expect(page.getByTestId('login-submit')).toBeVisible()
    await expect(page.getByTestId('login-forgot-password')).toBeVisible()
    await expect(page.getByTestId('login-sign-up')).toBeVisible()
  })

  test('should show validation errors for empty fields', async ({ page }) => {
    await page.getByTestId('login-submit').click()

    await expect(page.getByText(/valid email/i)).toBeVisible()
  })

  test('should show validation error for invalid email', async ({ page }) => {
    await page.getByTestId('login-email').fill('notanemail')
    await page.locator('form').evaluate((f) => {
      ;(f as HTMLFormElement).noValidate = true
    })
    await page.getByTestId('login-submit').click()

    await expect(page.getByText(/valid email/i)).toBeVisible()
  })

  test('should show validation error for short password', async ({ page }) => {
    await page.getByTestId('login-email').fill('test@finiq.test')
    await page.getByTestId('login-password').fill('abc')
    await page.getByTestId('login-submit').click()

    await expect(page.getByText(/password must/i)).toBeVisible()
  })

  test('should display error for incorrect credentials', async ({ page }) => {
    await page.getByTestId('login-email').fill('wrong@finiq.test')
    await page.getByTestId('login-password').fill('WrongPassword123!')
    await page.getByTestId('login-submit').click()

    await expect(page.getByText(/isn't associated/i)).toBeVisible()
  })

  test('should redirect to register page when clicking sign up link', async ({
    page,
  }) => {
    await page.getByTestId('login-sign-up').click()

    await expect(page).toHaveURL('/auth/register')
  })

  test('should navigate to forgot password page', async ({ page }) => {
    await page.getByTestId('login-forgot-password').click()

    await expect(page).toHaveURL('/auth/forgot-password')
  })
})
