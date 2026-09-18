import { expect, Locator, Page } from '@playwright/test';

export class EmployeePage {
    readonly page: Page;
    readonly pimMenu: Locator;
    readonly addEmployeeMenu: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly profilePictureInput: Locator;
    readonly saveButton: Locator;
    readonly successMessage: Locator;
    readonly employeeNameHeading: Locator;
    readonly employeeIdValue: Locator;

    constructor(page: Page) {
        this.page = page;
        this.pimMenu = page.getByRole('link', { name: 'PIM' });
        this.addEmployeeMenu = page.getByRole('link', { name: 'Add Employee' });
        this.firstNameInput = page.getByPlaceholder('First Name');
        this.lastNameInput = page.getByPlaceholder('Last Name');
        this.profilePictureInput = page.locator('input[type="file"]');
        this.saveButton = page.getByRole('button', { name: 'Save' });
        this.successMessage = page.getByText('Successfully Saved', { exact: false });
        this.employeeNameHeading = page.locator('.orangehrm-edit-employee-name');
        this.employeeIdValue = page.locator('.oxd-input-group').filter({ hasText: 'Employee Id' }).locator('input');
    }

    async openAddEmployee() {
        await this.pimMenu.click();
        await this.addEmployeeMenu.click();
        await expect(this.page).toHaveURL(/pim\/addEmployee/);
    }

    async createEmployee(
        firstName: string,
        lastName: string,
        profilePicturePath: string
    ) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.profilePictureInput.setInputFiles(profilePicturePath);
        await this.saveButton.click();
    }

    async expectEmployeeDetails(firstName: string, lastName: string) {
        await expect(this.page).toHaveURL(/pim\/viewPersonalDetails/, { timeout: 15000 });
        await expect(this.page.getByText(`${firstName} ${lastName}`, { exact: true })).toBeVisible();
        await expect(this.employeeIdValue).toBeVisible();
        await expect(this.employeeIdValue).not.toHaveValue('');
    }
}
