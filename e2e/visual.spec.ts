import { test, expect } from '@playwright/test';

test('login page visual regression', async ({ page }) => {
    // Skip on Linux (CI) as we don't have snapshots generated
    test.skip(process.platform === 'linux', 'Visual tests skipped on Linux');

    await page.goto('/login');
    await expect(page).toHaveScreenshot('login-page.png');
});
