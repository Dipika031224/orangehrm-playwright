import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('OrangeHRM Login', () => {

    test('Verify successful login with valid credentials', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigateToLoginPage();
        await loginPage.login('Admin', 'admin123');
        await expect(
            loginPage.dashboardHeading,
            'Dashboard should be visible after successful login'
        ).toBeVisible();
        await expect(
            page,
            'User should be redirected to the OrangeHRM dashboard'
        ).toHaveURL(/dashboard/);
    });
});