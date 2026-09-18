import { expect, Page, test } from '@playwright/test';
import path from 'node:path';
import employeeData from '../data/employee.json';
import { EmployeePage } from '../pages/EmployeePage';
import { LoginPage } from '../pages/LoginPage';

let latestEmployee: { id: string; firstName: string; lastName: string } | undefined;

test.describe.serial('OrangeHRM Employee Management', () => {
    for (const employee of employeeData.slice(0, 1)) {
        test(`Create employee: ${employee.firstName} ${employee.lastName}`, async ({ page }) => {
            test.setTimeout(90000);
            const loginPage = new LoginPage(page);
            const employeePage = new EmployeePage(page);
            if (!employee.profilePicture) {
                throw new Error(`Profile picture is required for ${employee.firstName} ${employee.lastName}.`);
            }
            const profilePicturePath = path.resolve(__dirname, employee.profilePicture);

            await loginPage.navigateToLoginPage();
            await loginPage.login('Admin', 'admin123');
            await employeePage.openAddEmployee();
            const employeeId = await employeePage.createEmployee(
                employee.firstName,
                employee.lastName,
                profilePicturePath
            );
            await employeePage.expectEmployeeDetails(
                employee.firstName,
                employee.lastName
            );

            latestEmployee = {
                id: employeeId,
                firstName: employee.firstName,
                lastName: employee.lastName
            };
        });
    }

    test('Edit latest employee Job Title', async ({ page }) => {
        test.setTimeout(60000);
        const employee = getLatestEmployee();
        const employeePage = await openLatestEmployee(page, employee.id);

        await employeePage.updateJobTitle('QA Engineer');
        await expect(page.getByText('QA Engineer', { exact: true })).toBeVisible();
    });

    test('Edit latest employee Employment Status', async ({ page }) => {
        test.setTimeout(60000);
        const employee = getLatestEmployee();
        const employeePage = await openLatestEmployee(page, employee.id);

        await employeePage.updateEmploymentStatus('Full-Time Permanent');
        await expect(page.getByText('Full-Time Permanent', { exact: true })).toBeVisible();
    });

    test('Verify latest employee Job updates', async ({ page }) => {
        test.setTimeout(60000);
        const employee = getLatestEmployee();
        const employeePage = await openLatestEmployee(page, employee.id);

        await employeePage.expectJobDetails('QA Engineer', 'Full-Time Permanent');
    });
});

function getLatestEmployee() {
    if (!latestEmployee) {
        throw new Error('No employee was created. Add employee tests must pass before edit tests run.');
    }

    return latestEmployee;
}

async function openLatestEmployee(page: Page, employeeId: string) {
    const loginPage = new LoginPage(page);
    const employeePage = new EmployeePage(page);

    await loginPage.navigateToLoginPage();
    await loginPage.login('Admin', 'admin123');
    await employeePage.searchEmployeeById(employeeId);
    await employeePage.editEmployee(employeeId);

    return employeePage;
}
