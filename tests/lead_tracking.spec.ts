import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load .env file
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
    ? process.env.ADMIN_PASSWORD.replace(/^['"]+|['"]+$/g, '').replace(/\\/g, '')
    : '&TxXUdEPsf6VpcY$UYc^';

const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'telecom_master_access';

test.describe('Lead Tracking & Workflow', () => {

    test('should capture UTM parameters from URL', async ({ page }) => {
        const utmParams = '?utm_source=google_ads&utm_campaign=winter_promo&utm_medium=cpc';
        const uniqueId = Date.now().toString().slice(-6);
        const name = `UTM Tester ${uniqueId}`;
        const phone = `08${Math.floor(10000000 + Math.random() * 90000000)}`;

        // 1. Visit lead page with UTM params
        await page.goto(`/bg/lead${utmParams}`);

        // 2. Submit form
        await page.getByPlaceholder('Ivan Ivanov').fill(name);
        await page.getByPlaceholder('0888 123 456').fill(phone);
        await page.locator('#consent').click();
        await page.getByRole('button', { name: 'Получи Офертите' }).click();

        // 3. Confirm phone
        await page.getByRole('button', { name: 'Потвърждавам' }).click();

        // 4. Wait for success (thank you page)
        await expect(page).toHaveURL(/\/thank-you/, { timeout: 10000 });

        // 5. Login to Admin to verify
        await page.goto(`/bg/admin/login?key=${ADMIN_SECRET_KEY}`);
        await page.getByPlaceholder('Въведете вашата парола').fill(ADMIN_PASSWORD);
        await page.getByRole('button', { name: 'Вход в системата' }).click();

        // 6. Go to Leads
        await page.goto('/bg/admin/leads');

        // Reload to ensure fresh data
        // Reload to ensure fresh data
        await page.reload();
        await page.waitForTimeout(1000); // Short wait for fetch to complete

        // 7. Find our lead and verify UTM data
        const leadRow = page.locator('tr', { hasText: name });
        await expect(leadRow).toBeVisible();
        await expect(leadRow.getByText('google_ads', { exact: false })).toBeVisible();

        // 8. Open details and verify full UTM stack
        await leadRow.getByRole('button').last().click();
        await expect(page.locator('text="winter_promo"').first()).toBeVisible();
        await expect(page.locator('text="cpc"').first()).toBeVisible();
        await expect(page.getByText('step_by_step_conversion', { exact: false })).toBeVisible();
    });

    test('should allow workflow updates (assignment & pipeline)', async ({ page }) => {
        // 1. Login to Admin
        await page.goto(`/bg/admin/login?key=${ADMIN_SECRET_KEY}`);
        await page.getByPlaceholder('Въведете вашата парола').fill(ADMIN_PASSWORD);
        await page.getByRole('button', { name: 'Вход в системата' }).click();

        // 2. Go to Leads
        await page.goto('/bg/admin/leads');

        // 3. Take the first lead (wait for it to load)
        const firstLeadRow = page.locator('tbody tr').first();
        await expect(firstLeadRow).toBeVisible({ timeout: 10000 });

        // 4. Change Agent
        const agentSelect = firstLeadRow.locator('select').first();
        await agentSelect.selectOption('Николай');

        // 5. Change Pipeline Status
        const statusSelect = firstLeadRow.locator('select').last();
        await statusSelect.selectOption('qualified');

        // 6. Reload and verify persistence
        await page.reload();
        await expect(page.locator('tbody tr').first().locator('select').first()).toHaveValue('Николай');
        await expect(page.locator('tbody tr').first().locator('select').last()).toHaveValue('qualified');

        // 7. Check notes persistence
        await page.locator('tbody tr').first().getByRole('button').last().click();
        const notesArea = page.locator('textarea');
        const testNote = `Test note at ${new Date().getTime()}`;
        await notesArea.fill(testNote);
        await notesArea.blur(); // Triggers update

        // Wait a bit for the update to finish (it's debounced or onBlur)
        await page.waitForTimeout(1000);

        await page.reload();
        await page.locator('tbody tr').first().getByRole('button').last().click();
        await expect(page.locator('textarea')).toHaveValue(testNote);
    });
});
