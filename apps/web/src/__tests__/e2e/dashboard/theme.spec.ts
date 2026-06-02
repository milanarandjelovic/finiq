import { expect, test } from '@/__tests__/e2e/fixtures/auth'

test.describe('Theme toggle', () => {
  test('should toggle from light to dark mode', async ({ authedPage }) => {
    await authedPage.evaluate(() =>
      localStorage.setItem('__finiq_theme', 'light'),
    )
    await authedPage.goto('/dashboard')

    const toggle = authedPage.getByTestId('theme-toggle')
    await toggle.click()

    await expect(authedPage.locator('html')).toHaveClass(/dark/)
  })

  test('should toggle from dark to light mode', async ({ authedPage }) => {
    await authedPage.evaluate(() =>
      localStorage.setItem('__finiq_theme', 'light'),
    )
    await authedPage.goto('/dashboard')

    const toggle = authedPage.getByTestId('theme-toggle')

    await toggle.click()
    await expect(authedPage.locator('html')).toHaveClass(/dark/)

    await toggle.click()
    await expect(authedPage.locator('html')).not.toHaveClass(/dark/)
  })

  test('should persist theme across page reload', async ({ authedPage }) => {
    await authedPage.evaluate(() =>
      localStorage.setItem('__finiq_theme', 'light'),
    )
    await authedPage.goto('/dashboard')

    await authedPage.getByTestId('theme-toggle').click()
    await expect(authedPage.locator('html')).toHaveClass(/dark/)

    await authedPage.reload()
    await expect(authedPage.locator('html')).toHaveClass(/dark/)
  })
})
