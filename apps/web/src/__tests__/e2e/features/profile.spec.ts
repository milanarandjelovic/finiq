import { expect, test } from '@/__tests__/e2e/fixtures/auth'

test.describe('Profile page', () => {
  test('should render the profile page', async ({ authedPage }) => {
    await authedPage.goto('/dashboard/profile')

    await expect(authedPage.getByText(/profile/i).first()).toBeVisible()
  })

  test('should display the personal information form', async ({
    authedPage,
  }) => {
    await authedPage.goto('/dashboard/profile')

    await expect(
      authedPage.getByText(/personal information/i).first(),
    ).toBeVisible({ timeout: 10_000 })
  })

  test('should update the user name', async ({ authedPage }) => {
    await authedPage.goto('/dashboard/profile')

    const nameInput = authedPage.getByLabel(/full name/i)
    await expect(nameInput).toBeVisible({ timeout: 10_000 })

    await nameInput.clear()
    await nameInput.fill('Updated Test Name')
    await authedPage.getByTestId('profile-save-btn').click()

    await expect(authedPage.getByText('Profile updated')).toBeVisible({
      timeout: 10_000,
    })
  })

  test('should display the change password form', async ({ authedPage }) => {
    await authedPage.goto('/dashboard/profile')
    await authedPage.getByRole('tab', { name: /change password/i }).click()

    await expect(authedPage.getByTestId('current-password-input')).toBeVisible()
    await expect(authedPage.getByTestId('new-password-input')).toBeVisible()
    await expect(authedPage.getByTestId('confirm-password-input')).toBeVisible()
  })

  test('should change the password successfully', async ({
    authedPage,
    testUser,
  }) => {
    await authedPage.goto('/dashboard/profile')
    await authedPage.getByRole('tab', { name: /change password/i }).click()

    await expect(authedPage.getByTestId('current-password-input')).toBeVisible({
      timeout: 10_000,
    })

    await authedPage
      .getByTestId('current-password-input')
      .fill(testUser.password)
    await authedPage.getByTestId('new-password-input').fill('NewP@ssword123')
    await authedPage
      .getByTestId('confirm-password-input')
      .fill('NewP@ssword123')
    await authedPage.getByTestId('change-password-submit').click()

    await expect(authedPage.getByText('Password changed')).toBeVisible({
      timeout: 10_000,
    })
  })

  test('should show validation errors for mismatched passwords', async ({
    authedPage,
  }) => {
    await authedPage.goto('/dashboard/profile')
    await authedPage.getByRole('tab', { name: /change password/i }).click()

    await expect(authedPage.getByTestId('current-password-input')).toBeVisible({
      timeout: 10_000,
    })

    await authedPage.getByTestId('current-password-input').fill('OldP@ss1')
    await authedPage.getByTestId('new-password-input').fill('NewP@ss1')
    await authedPage
      .getByTestId('confirm-password-input')
      .fill('DifferentP@ss1')
    await authedPage.getByTestId('change-password-submit').click()

    await expect(authedPage.getByText(/must match/i)).toBeVisible({
      timeout: 5_000,
    })
  })
})
