import { expect, Locator, Page } from '@playwright/test';

export class LogoutPage {
    readonly page: Page;
    readonly userMenu: Locator;
    readonly logoutLink: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.userMenu = page.locator('.oxd-userdropdown-tab');
        this.logoutLink = page.getByText('Logout', { exact: true });
        this.loginButton = page.getByRole('button', { name: 'Login' });
    }

    async logout() {
        await this.userMenu.click();
        await this.logoutLink.click();
    }

    async expectSessionInvalidated() {
        await expect(this.page).toHaveURL(/auth\/login/);
        await expect(this.loginButton).toBeVisible();
    }
}