import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load .env file
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
    ? process.env.ADMIN_PASSWORD.replace(/^['"]+|['"]+$/g, '').replace(/\\/g, '')
    : '&TxXUdEPsf6VpcY$UYc^';

const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'telecom_master_access';

test.describe('Admin Protection & Dashboard', () => {

    test.beforeEach(async ({ context }) => {
        await context.clearCookies();
    });

    test('should show 404 when accessing admin without session or secret', async ({ page }) => {
        await page.goto('/bg/admin/leads');
        // It's a rewrite, so URL stays but content is 404
        await expect(page.getByText(/404|не е намерена/i)).toBeVisible();
    });

    test('should show login page only with secret key', async ({ page }) => {
        await page.goto(`/bg/admin/login?key=${ADMIN_SECRET_KEY}`);
        await expect(page.getByText('Админ Достъп')).toBeVisible();
    });

    test('should show error with wrong password on login page', async ({ page }) => {
        await page.goto(`/bg/admin/login?key=${ADMIN_SECRET_KEY}`);
        await page.getByPlaceholder('Въведете вашата парола').fill('wrongpassword');
        await page.getByRole('button', { name: 'Вход в системата' }).click();
        await expect(page.getByText('Невалидна парола')).toBeVisible();
    });

    test('should login successfully with correct password', async ({ page }) => {
        await page.goto(`/bg/admin/login?key=${ADMIN_SECRET_KEY}`);
        await page.getByPlaceholder('Въведете вашата парола').fill(ADMIN_PASSWORD);
        await page.getByRole('button', { name: 'Вход в системата' }).click();

        await expect(page).toHaveURL(/\/admin$/, { timeout: 10000 });
        await expect(page.getByRole('heading', { name: 'Админ Табло' })).toBeVisible();
    });

    test('should persist authentication via cookies', async ({ page }) => {
        await page.goto(`/bg/admin/login?key=${ADMIN_SECRET_KEY}`);
        await page.getByPlaceholder('Въведете вашата парола').fill(ADMIN_PASSWORD);
        await page.getByRole('button', { name: 'Вход в системата' }).click();
        await expect(page.getByRole('heading', { name: 'Админ Табло' })).toBeVisible();

        await page.reload();
        await expect(page.getByRole('heading', { name: 'Админ Табло' })).toBeVisible();
    });

    test('should logout successfully', async ({ page }) => {
        await page.goto(`/bg/admin/login?key=${ADMIN_SECRET_KEY}`);
        await page.getByPlaceholder('Въведете вашата парола').fill(ADMIN_PASSWORD);
        await page.getByRole('button', { name: 'Вход в системата' }).click();

        await expect(page.getByRole('button', { name: 'Изход' })).toBeVisible();
        await page.getByRole('button', { name: 'Изход' }).click();

        await expect(page).not.toHaveURL(/\/admin/);

        await page.goto('/bg/admin');
        await expect(page.getByText(/404|не е намерена/i)).toBeVisible();
    });
});

test.describe('Admin Leads Features', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto(`/bg/admin/login?key=${ADMIN_SECRET_KEY}`);
        await page.getByPlaceholder('Въведете вашата парола').fill(ADMIN_PASSWORD);
        await page.getByRole('button', { name: 'Вход в системата' }).click();

        // Wait for dashboard then go to leads
        await expect(page.getByRole('heading', { name: 'Админ Табло' })).toBeVisible();
        await page.goto('/bg/admin/leads');
        await expect(page.getByRole('heading', { name: 'Запитвания', exact: true })).toBeVisible();
    });

    test('should filter leads', async ({ page }) => {
        const filterAll = page.getByRole('button', { name: 'Всички', exact: true });
        const filterUnique = page.getByRole('button', { name: 'Уникални', exact: true });
        const filterDuplicate = page.getByRole('button', { name: 'Повторни', exact: true });

        await expect(filterAll).toBeVisible();
        await filterUnique.click();
        await filterDuplicate.click();
        await filterAll.click();
    });

    test('should mark a lead as contacted (persisted)', async ({ page }) => {
        const vezmiButtons = page.getByRole('button', { name: 'Вземи' }).filter({ visible: true });

        if (await vezmiButtons.count() > 0) {
            const countBefore = await vezmiButtons.count();
            await vezmiButtons.first().click();
            await expect(vezmiButtons).toHaveCount(countBefore - 1);

            await page.reload();
            await expect(page.getByRole('button', { name: 'Вземи' }).filter({ visible: true })).toHaveCount(countBefore - 1);
        }
    });
});
