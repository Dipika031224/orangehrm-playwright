import { test } from '@playwright/test';
import { EmployeePage } from '../pages/EmployeePage';
import { LoginPage } from '../pages/LoginPage';

test('Verify employee delete confirmation popup', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const employeePage = new EmployeePage(page);

    await loginPage.navigateToLoginPage();
    await loginPage.login('Admin', 'admin123');
    const employeeId = await employeePage.getTopEmployeeId();
    await employeePage.searchEmployeeById(employeeId);
    await employeePage.openDeleteConfirmation(employeeId);
    await employeePage.cancelDeleteConfirmation(employeeId);
});