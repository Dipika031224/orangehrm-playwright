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
    readonly employeeListMenu: Locator;
    readonly searchButton: Locator;
    readonly jobTab: Locator;

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
        this.employeeListMenu = page.getByText('Employee List', { exact: true });
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.jobTab = page.getByText('Job', { exact: true });
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
        for (let attempt = 0; attempt < 2; attempt++) {
            await this.firstNameInput.fill(firstName);
            await this.lastNameInput.fill(lastName);
            await this.profilePictureInput.setInputFiles(profilePicturePath);
            const employeeId = await this.employeeIdValue.inputValue();
            await this.saveButton.click();

            try {
                await expect(this.page).toHaveURL(/pim\/viewPersonalDetails/, { timeout: 20000 });
                return employeeId;
            } catch {
                if (attempt === 0) {
                    await this.page.reload();
                    await expect(this.firstNameInput).toBeVisible();
                }
            }
        }

        throw new Error('Employee save did not navigate to the employee details page. Check the Add Employee validation message.');
    }

    async expectEmployeeDetails(firstName: string, lastName: string) {
        await expect(this.page).toHaveURL(/pim\/viewPersonalDetails/, { timeout: 15000 });
        await expect(this.page.getByText(`${firstName} ${lastName}`, { exact: true })).toBeVisible();
        await expect(this.employeeIdValue).toBeVisible();
        await expect(this.employeeIdValue).not.toHaveValue('');
    }

    async getGeneratedEmployeeId() {
        return this.employeeIdValue.inputValue();
    }

    async searchEmployeeById(employeeId: string) {
        await this.pimMenu.click();
        await this.employeeListMenu.click();
        await expect(this.page).toHaveURL(/pim\/viewEmployeeList/);
        const employeeIdInput = this.page.locator('.oxd-input-group').filter({ hasText: 'Employee Id' }).locator('input');
        await employeeIdInput.fill(employeeId);
        await this.searchButton.click();
        await expect(this.page.locator('.oxd-table-row').filter({ hasText: employeeId })).toBeVisible();
    }

    async getTopEmployeeId() {
        await this.pimMenu.click();
        await this.employeeListMenu.click();
        await expect(this.page).toHaveURL(/pim\/viewEmployeeList/);

        await expect(this.page.locator('.oxd-table-body')).toBeVisible({ timeout: 15000 });
        const firstRow = this.page.locator('.oxd-table-body .oxd-table-row').first();
        await expect(firstRow).toBeVisible({ timeout: 15000 });
        return (await firstRow.locator('.oxd-table-cell').nth(1).innerText()).trim();
    }

    async editEmployee(employeeId: string) {
        const employeeRow = this.page.locator('.oxd-table-row').filter({ hasText: employeeId });
        await employeeRow.locator('.oxd-table-cell-actions button').first().click();
        await expect(this.page).toHaveURL(/pim\/viewPersonalDetails/);
    }

    async openDeleteConfirmation(employeeId: string) {
        const employeeRow = this.page.locator('.oxd-table-row').filter({ hasText: employeeId });
        await employeeRow.locator('.oxd-table-cell-actions button').last().click();

        const deleteMessage = this.page.getByText('The selected record will be permanently deleted.', { exact: false });
        await expect(deleteMessage).toBeVisible();
        await expect(this.page.getByRole('button', { name: 'No, Cancel' })).toBeVisible();
        await expect(this.page.getByRole('button', { name: 'Yes, Delete' })).toBeVisible();
    }

    async cancelDeleteConfirmation(employeeId: string) {
        const employeeRow = this.page.locator('.oxd-table-row').filter({ hasText: employeeId });
        const deleteMessage = this.page.getByText('The selected record will be permanently deleted.', { exact: false });
        await this.page.getByRole('button', { name: 'No, Cancel' }).click();
        await expect(deleteMessage).toBeHidden();
        await expect(employeeRow).toBeVisible();
    }

    async updateJobDetails(jobTitle: string, employmentStatus: string) {
        await this.jobTab.click();
        await expect(this.page.getByText('Job Details', { exact: true })).toBeVisible();
        await this.selectDropdownValue('Job Title', jobTitle);
        await this.selectDropdownValue('Employment Status', employmentStatus);
        await this.page.getByRole('button', { name: 'Save' }).click();
        await expect(this.getDropdownField('Job Title')).toContainText(jobTitle);
        await expect(this.getDropdownField('Employment Status')).toContainText(employmentStatus);
    }

    async updateJobTitle(jobTitle: string) {
        await this.openJobTab();
        await this.selectDropdownValue('Job Title', jobTitle);
        await this.page.getByRole('button', { name: 'Save' }).click();
        await expect(this.getDropdownField('Job Title')).toContainText(jobTitle);
    }

    async updateEmploymentStatus(employmentStatus: string) {
        await this.openJobTab();
        await this.selectDropdownValue('Employment Status', employmentStatus);
        await this.page.getByRole('button', { name: 'Save' }).click();
        await expect(this.getDropdownField('Employment Status')).toContainText(employmentStatus);
    }

    async expectJobDetails(jobTitle: string, employmentStatus: string) {
        await this.openJobTab();
        await expect(this.getDropdownField('Job Title')).toContainText(jobTitle);
        await expect(this.getDropdownField('Employment Status')).toContainText(employmentStatus);
    }

    private async openJobTab() {
        await this.jobTab.click();
        await expect(this.page.getByText('Job Details', { exact: true })).toBeVisible();
    }

    private async selectDropdownValue(label: string, value: string) {
        const field = this.getDropdownField(label);
        await field.locator('.oxd-select-text').click();
        await this.page.locator('.oxd-select-option').getByText(value, { exact: true }).click();
    }

    private getDropdownField(label: string) {
        return this.page.locator('.oxd-input-group').filter({ hasText: label });
    }
}
