import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.ENV || 'dev'}` });

export default defineConfig({
  testDir: './src',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'playwright-report/report.json' }],
    ['allure-playwright'],
    ['list'],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: process.env.TRACE === 'always' ? 'always' : 'on-first-retry',
    video: process.env.VIDEO === 'always' ? 'always' : 'on-first-retry',
    screenshot: 'only-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000,
    contextOptions: {
      locale: 'ru-RU',
      timezoneId: 'Europe/Moscow',
    },
  },
  projects: process.env.BROWSERS
    ? process.env.BROWSERS.split(',').map((browser) => ({
        name: browser.trim(),
        use: { ...devices[browser.trim() as keyof typeof devices] },
      }))
    : [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
        { name: 'webkit', use: { ...devices['Desktop Safari'] } },
      ],
  outputDir: 'test-results',
  timeout: parseInt(process.env.TIMEOUT || '30000', 10),
  expect: {
    timeout: 5000,
    toHaveScreenshot: {
      maxDiffPixels: 100,
    },
  },
});
