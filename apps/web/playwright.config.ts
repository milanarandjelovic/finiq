import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './src/__tests__/e2e',
  globalSetup: './src/__tests__/e2e/global-setup.ts',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['html'], ['list']],
  timeout: 90_000,
  use: {
    baseURL: 'http://localhost:3000',
    storageState: './src/__tests__/e2e/.auth/storage-state.json',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    navigationTimeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'bun run dev',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
      env: {
        NEXT_PUBLIC_API_URL: 'http://localhost:4000',
        NEXT_PUBLIC_I18N_URL: 'http://localhost:4001',
        E2E_TEST_EMAIL: process.env.E2E_TEST_EMAIL ?? 'info@email.com',
        E2E_TEST_PASSWORD: process.env.E2E_TEST_PASSWORD ?? '1Jc1uE@1uKi7rx-=',
      },
    },
  ],
})
