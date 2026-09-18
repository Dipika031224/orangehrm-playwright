import { test } from '@playwright/test';
import path from 'node:path';
import employeeData from '../data/employee.json';
import { EmployeePage } from '../pages/EmployeePage';
import { LoginPage } from '../pages/LoginPage';

test.describe('OrangeHRM Employee Management', () => {
    for (const employee of employeeData) {
        test(`Create employee: ${employee.firstName} ${employee.lastName}`, async ({ page }) => {
            const loginPage = new LoginPage(page);
            const employeePage = new EmployeePage(page);
            const profilePicturePath = path.resolve(__dirname, employee.profilePicture);

            await loginPage.navigateToLoginPage();
            await loginPage.login('Admin', 'admin123');
            await employeePage.openAddEmployee();
            await employeePage.createEmployee(
                employee.firstName,
                employee.lastName,
                profilePicturePath
            );
            await employeePage.expectEmployeeDetails(
                employee.firstName,
                employee.lastName
            );
        });
    }
});
