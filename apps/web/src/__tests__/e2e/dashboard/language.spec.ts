import { expect, test } from '@/__tests__/e2e/fixtures/auth'

test.describe('Language picker', () => {
  test('should display the language picker in the header', async ({
    authedPage,
  }) => {
    await authedPage.goto('/dashboard')

    await expect(
      authedPage.getByTestId('language-picker-trigger'),
    ).toBeVisible()
  })

  test('should show the current language name by default', async ({
    authedPage,
  }) => {
    await authedPage.goto('/dashboard')

    await expect(
      authedPage.getByTestId('language-picker-trigger'),
    ).toContainText('English')
  })

  test('should persist language across page reload', async ({ authedPage }) => {
    await authedPage.goto('/dashboard')
    await authedPage.getByTestId('language-picker-trigger').click()
    await authedPage.getByTestId('language-option-sr').click()
    await authedPage.waitForTimeout(500)
    await authedPage.reload()
    await authedPage.waitForLoadState('networkidle')

    await expect(
      authedPage.getByTestId('language-picker-trigger'),
    ).toContainText('Srpski')
  })
})
