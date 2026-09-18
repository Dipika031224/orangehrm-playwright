import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { LogoutPage } from '../pages/LogoutPage';

test.describe('OrangeHRM Logout', () => {

    test('Verify successful logout', async ({ page }) => {

        const loginPage = new LoginPage(page);
        const logoutPage = new LogoutPage(page);

        // Step 1: Navigate to OrangeHRM
        await loginPage.navigateToLoginPage();

        // Step 2: Login
        await loginPage.login('Admin', 'admin123');

        // Step 3: Verify Dashboard
        await expect(
            loginPage.dashboardHeading,
            'Dashboard should be visible after successful login'
        ).toBeVisible();

        // Step 4: Logout
        await logoutPage.logout();

        // Step 5: Verify Login button
        await expect(
            logoutPage.loginButton,
            'Login button should be visible after logout'
        ).toBeVisible();

        // Step 6: Verify Login URL
        await expect(
            page,
            'User should be redirected to login page after logout'
        ).toHaveURL(/\/auth\/login/);

    });
});