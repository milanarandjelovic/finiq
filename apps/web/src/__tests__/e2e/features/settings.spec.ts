import { expect, test } from '@/__tests__/e2e/fixtures/auth'

test.describe('Settings page', () => {
  test('should render the settings page', async ({ authedPage }) => {
    await authedPage.goto('/dashboard/settings')

    await expect(authedPage.getByText(/settings/i).first()).toBeVisible()
  })

  test('should display the current currency selection', async ({
    authedPage,
  }) => {
    await authedPage.goto('/dashboard/settings')

    await expect(authedPage.getByText(/currency/i).first()).toBeVisible()
    await expect(authedPage.getByTestId('currency-select')).toBeVisible({
      timeout: 10_000,
    })
  })

  test('should display the current language selection', async ({
    authedPage,
  }) => {
    await authedPage.goto('/dashboard/settings')

    await expect(authedPage.getByText(/language/i).first()).toBeVisible()
  })

  test('should update the currency setting', async ({ authedPage }) => {
    await authedPage.goto('/dashboard/settings')

    await expect(authedPage.getByTestId('currency-select')).toBeVisible({
      timeout: 10_000,
    })

    await authedPage.getByTestId('currency-select').click()
    await authedPage.getByRole('option', { name: /EUR/i }).click()
    await authedPage.getByTestId('settings-save-btn').click()

    await expect(authedPage.getByText('Settings saved')).toBeVisible({
      timeout: 10_000,
    })
  })

  test('should save settings successfully', async ({ authedPage }) => {
    await authedPage.goto('/dashboard/settings')

    await expect(authedPage.getByTestId('settings-save-btn')).toBeVisible({
      timeout: 10_000,
    })

    await authedPage.getByTestId('settings-save-btn').click()

    await expect(authedPage.getByText('Settings saved')).toBeVisible({
      timeout: 10_000,
    })
  })
})
