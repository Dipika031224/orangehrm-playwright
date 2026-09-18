import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { LogoutPage } from '../pages/LogoutPage';

test('Confirm successful logout and invalidated session', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const logoutPage = new LogoutPage(page);

    await loginPage.navigateToLoginPage();
    await loginPage.login('Admin', 'admin123');
    await expect(loginPage.dashboardHeading).toBeVisible();

    await logoutPage.logout();
    await logoutPage.expectSessionInvalidated();

    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');
    await logoutPage.expectSessionInvalidated();
});