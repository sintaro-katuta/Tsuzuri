import { test, expect } from '@playwright/test';
import { addDays, format } from 'date-fns';

test.describe('Trip CRUD', () => {
    test('should create, update, and delete a trip', async ({ page }) => {
        // 1. Create Trip
        await page.goto('/dashboard');
        await expect(page.getByRole('heading', { name: '旅のしおり一覧' })).toBeVisible();

        const tripTitle = `Test Trip ${Date.now()}`;
        await page.getByPlaceholder('例: 京都2泊3日の旅').fill(tripTitle);

        // Select dates
        await page.getByPlaceholder('日程を選択').click();
        // Assuming the calendar shows current month. Click two distinct dates.
        // This is fragile if dates are disabled or cross months, but trying simple click first.
        // Locate standard day cells.
        const today = new Date();
        const startDate = today.getDate();
        const endDate = addDays(today, 2).getDate();

        // Use exact text match for date numbers to avoid partial matches
        // Note: The date cells are divs, not buttons
        await page.getByText(startDate.toString(), { exact: true }).first().click();
        await page.getByText(endDate.toString(), { exact: true }).first().click();

        await page.getByRole('button', { name: '旅行を作成する' }).click();

        // 2. Read (Verify detail page)
        await expect(page).toHaveURL(/\/trips\/.*/);
        await expect(page.getByRole('heading', { name: tripTitle })).toBeVisible();

        // Take screenshot of new trip
        await expect(page).toHaveScreenshot('trip-detail-initial.png');

        // 3. Update
        await page.getByRole('button', { name: 'Settings' }).click({ force: true });

        // Expect modal to appear
        const updatedTitle = `${tripTitle} Updated`;
        await page.locator('input[name="title"]').fill(updatedTitle);
        await page.getByRole('button', { name: '保存' }).click();

        // Check if modal is still open (form submission might not close it in existing app logic)
        // If "旅行を削除" is visible, modal is open.
        // We can close it by clicking Cancel or Overlay. 
        // Let's try closing it to ensure clean state for next step.
        if (await page.getByRole('button', { name: 'キャンセル' }).first().isVisible()) {
            await page.getByRole('button', { name: 'キャンセル' }).first().click();
        }

        // Verify update
        await expect(page.getByRole('heading', { name: updatedTitle })).toBeVisible();

        // 4. Delete
        // Re-open settings (using force if needed, although clean state preferred)
        await page.getByRole('button', { name: 'Settings' }).click({ force: true });

        // Click "旅行を削除" to verify delete flow
        await page.getByRole('button', { name: '旅行を削除' }).click();

        // Confirm delete in the separate view
        await page.getByRole('button', { name: '完全に削除する' }).click();

        // Verify redirect to dashboard
        await expect(page).toHaveURL(/.*dashboard/);

        // Verify deletion
        await expect(page.getByText(updatedTitle)).not.toBeVisible();
    });
});
