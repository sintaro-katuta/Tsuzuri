import { test, expect } from '@playwright/test';

test('login page visual regression', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveScreenshot('login-page.png');
});
