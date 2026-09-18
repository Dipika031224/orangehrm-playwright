# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: delete-employee.spec.ts >> Verify employee delete confirmation popup
- Location: tests\delete-employee.spec.ts:5:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.orangehrm-dialog-container')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('.orangehrm-dialog-container') with timeout 5000ms
  - waiting for locator('.orangehrm-dialog-container')

```

```yaml
- complementary:
  - navigation "Sidepanel":
    - link "client brand banner":
      - /url: https://www.orangehrm.com/
      - img "client brand banner"
    - textbox "Search"
    - button ""
    - separator
    - list:
      - listitem:
        - link "Admin":
          - /url: /web/index.php/admin/viewAdminModule
      - listitem:
        - link "PIM":
          - /url: /web/index.php/pim/viewPimModule
      - listitem:
        - link "Leave":
          - /url: /web/index.php/leave/viewLeaveModule
      - listitem:
        - link "Time":
          - /url: /web/index.php/time/viewTimeModule
      - listitem:
        - link "Recruitment":
          - /url: /web/index.php/recruitment/viewRecruitmentModule
      - listitem:
        - link "My Info":
          - /url: /web/index.php/pim/viewMyDetails
      - listitem:
        - link "Performance":
          - /url: /web/index.php/performance/viewPerformanceModule
      - listitem:
        - link "Dashboard":
          - /url: /web/index.php/dashboard/index
      - listitem:
        - link "Directory":
          - /url: /web/index.php/directory/viewDirectory
      - listitem:
        - link "Maintenance":
          - /url: /web/index.php/maintenance/viewMaintenanceModule
      - listitem:
        - link "Claim":
          - /url: /web/index.php/claim/viewClaimModule
          - img
          - text: Claim
      - listitem:
        - link "Buzz":
          - /url: /web/index.php/buzz/viewBuzz
- banner:
  - heading "PIM" [level=6]
  - link "Upgrade":
    - /url: https://orangehrm.com/open-source/upgrade-to-advanced
    - button "Upgrade"
  - list:
    - listitem:
      - img "profile picture"
      - paragraph: mandaa Delgado
      - text: 
  - navigation "Topbar Menu":
    - list:
      - listitem: Configuration 
      - listitem:
        - link "Employee List":
          - /url: "#"
      - listitem:
        - link "Add Employee":
          - /url: "#"
      - listitem:
        - link "Reports":
          - /url: "#"
      - button ""
- heading "Employee Information" [level=5]
- button ""
- separator
- text: Employee Name
- textbox "Type for hints..."
- text: Employee Id
- textbox: "1"
- text: Employment Status -- Select --  Include Current Employees Only  Supervisor Name
- textbox "Type for hints..."
- text: Job Title -- Select --  Sub Unit -- Select -- 
- separator
- button "Reset"
- button "Search"
- button " Add"
- separator
- text: (1) Record Found
- table:
  - rowgroup:
    - row " Id  First (& Middle) Name  Last Name  Job Title  Employment Status  Sub Unit  Supervisor  Actions":
      - columnheader "":
        - checkbox ""
        - text: 
      - columnheader "Id "
      - columnheader "First (& Middle) Name "
      - columnheader "Last Name "
      - columnheader "Job Title "
      - columnheader "Employment Status "
      - columnheader "Sub Unit "
      - columnheader "Supervisor "
      - columnheader "Actions"
  - rowgroup:
    - row " 1 a b  ":
      - cell "":
        - checkbox ""
        - text: 
      - cell "1"
      - cell "a"
      - cell "b"
      - cell
      - cell
      - cell
      - cell
      - cell " ":
        - button ""
        - button ""
- paragraph: OrangeHRM OS 5.9
- paragraph:
  - text: © 2005 - 2026
  - link "OrangeHRM, Inc":
    - /url: http://www.orangehrm.com
  - text: . All rights reserved.
- dialog:
  - document:
    - button "×"
    - paragraph: Are you Sure?
    - paragraph: The selected record will be permanently deleted. Are you sure you want to continue?
    - button "No, Cancel"
    - button " Yes, Delete"
```

# Test source

```ts
  9   |     readonly profilePictureInput: Locator;
  10  |     readonly saveButton: Locator;
  11  |     readonly successMessage: Locator;
  12  |     readonly employeeNameHeading: Locator;
  13  |     readonly employeeIdValue: Locator;
  14  |     readonly employeeListMenu: Locator;
  15  |     readonly searchButton: Locator;
  16  |     readonly jobTab: Locator;
  17  | 
  18  |     constructor(page: Page) {
  19  |         this.page = page;
  20  |         this.pimMenu = page.getByRole('link', { name: 'PIM' });
  21  |         this.addEmployeeMenu = page.getByRole('link', { name: 'Add Employee' });
  22  |         this.firstNameInput = page.getByPlaceholder('First Name');
  23  |         this.lastNameInput = page.getByPlaceholder('Last Name');
  24  |         this.profilePictureInput = page.locator('input[type="file"]');
  25  |         this.saveButton = page.getByRole('button', { name: 'Save' });
  26  |         this.successMessage = page.getByText('Successfully Saved', { exact: false });
  27  |         this.employeeNameHeading = page.locator('.orangehrm-edit-employee-name');
  28  |         this.employeeIdValue = page.locator('.oxd-input-group').filter({ hasText: 'Employee Id' }).locator('input');
  29  |         this.employeeListMenu = page.getByText('Employee List', { exact: true });
  30  |         this.searchButton = page.getByRole('button', { name: 'Search' });
  31  |         this.jobTab = page.getByText('Job', { exact: true });
  32  |     }
  33  | 
  34  |     async openAddEmployee() {
  35  |         await this.pimMenu.click();
  36  |         await this.addEmployeeMenu.click();
  37  |         await expect(this.page).toHaveURL(/pim\/addEmployee/);
  38  |     }
  39  | 
  40  |     async createEmployee(
  41  |         firstName: string,
  42  |         lastName: string,
  43  |         profilePicturePath: string
  44  |     ) {
  45  |         for (let attempt = 0; attempt < 2; attempt++) {
  46  |             await this.firstNameInput.fill(firstName);
  47  |             await this.lastNameInput.fill(lastName);
  48  |             await this.profilePictureInput.setInputFiles(profilePicturePath);
  49  |             const employeeId = await this.employeeIdValue.inputValue();
  50  |             await this.saveButton.click();
  51  | 
  52  |             try {
  53  |                 await expect(this.page).toHaveURL(/pim\/viewPersonalDetails/, { timeout: 20000 });
  54  |                 return employeeId;
  55  |             } catch {
  56  |                 if (attempt === 0) {
  57  |                     await this.page.reload();
  58  |                     await expect(this.firstNameInput).toBeVisible();
  59  |                 }
  60  |             }
  61  |         }
  62  | 
  63  |         throw new Error('Employee save did not navigate to the employee details page. Check the Add Employee validation message.');
  64  |     }
  65  | 
  66  |     async expectEmployeeDetails(firstName: string, lastName: string) {
  67  |         await expect(this.page).toHaveURL(/pim\/viewPersonalDetails/, { timeout: 15000 });
  68  |         await expect(this.page.getByText(`${firstName} ${lastName}`, { exact: true })).toBeVisible();
  69  |         await expect(this.employeeIdValue).toBeVisible();
  70  |         await expect(this.employeeIdValue).not.toHaveValue('');
  71  |     }
  72  | 
  73  |     async getGeneratedEmployeeId() {
  74  |         return this.employeeIdValue.inputValue();
  75  |     }
  76  | 
  77  |     async searchEmployeeById(employeeId: string) {
  78  |         await this.pimMenu.click();
  79  |         await this.employeeListMenu.click();
  80  |         await expect(this.page).toHaveURL(/pim\/viewEmployeeList/);
  81  |         const employeeIdInput = this.page.locator('.oxd-input-group').filter({ hasText: 'Employee Id' }).locator('input');
  82  |         await employeeIdInput.fill(employeeId);
  83  |         await this.searchButton.click();
  84  |         await expect(this.page.locator('.oxd-table-row').filter({ hasText: employeeId })).toBeVisible();
  85  |     }
  86  | 
  87  |     async getTopEmployeeId() {
  88  |         await this.pimMenu.click();
  89  |         await this.employeeListMenu.click();
  90  |         await expect(this.page).toHaveURL(/pim\/viewEmployeeList/);
  91  | 
  92  |         await expect(this.page.locator('.oxd-table-body')).toBeVisible({ timeout: 15000 });
  93  |         const firstRow = this.page.locator('.oxd-table-body .oxd-table-row').first();
  94  |         await expect(firstRow).toBeVisible({ timeout: 15000 });
  95  |         return (await firstRow.locator('.oxd-table-cell').nth(1).innerText()).trim();
  96  |     }
  97  | 
  98  |     async editEmployee(employeeId: string) {
  99  |         const employeeRow = this.page.locator('.oxd-table-row').filter({ hasText: employeeId });
  100 |         await employeeRow.locator('.oxd-table-cell-actions button').first().click();
  101 |         await expect(this.page).toHaveURL(/pim\/viewPersonalDetails/);
  102 |     }
  103 | 
  104 |     async openDeleteConfirmation(employeeId: string) {
  105 |         const employeeRow = this.page.locator('.oxd-table-row').filter({ hasText: employeeId });
  106 |         await employeeRow.locator('.oxd-table-cell-actions button').last().click();
  107 | 
  108 |         const dialog = this.page.locator('.orangehrm-dialog-container');
> 109 |         await expect(dialog).toBeVisible();
      |                              ^ Error: expect(locator).toBeVisible() failed
  110 |         await expect(dialog).toContainText('The selected record will be permanently deleted.');
  111 |         await expect(dialog.getByRole('button', { name: 'No, Cancel' })).toBeVisible();
  112 |         await expect(dialog.getByRole('button', { name: 'Yes, Delete' })).toBeVisible();
  113 |     }
  114 | 
  115 |     async cancelDeleteConfirmation(employeeId: string) {
  116 |         const employeeRow = this.page.locator('.oxd-table-row').filter({ hasText: employeeId });
  117 |         const dialog = this.page.locator('.orangehrm-dialog-container');
  118 |         await dialog.getByRole('button', { name: 'No, Cancel' }).click();
  119 |         await expect(dialog).toBeHidden();
  120 |         await expect(employeeRow).toBeVisible();
  121 |     }
  122 | 
  123 |     async updateJobDetails(jobTitle: string, employmentStatus: string) {
  124 |         await this.jobTab.click();
  125 |         await expect(this.page.getByText('Job Details', { exact: true })).toBeVisible();
  126 |         await this.selectDropdownValue('Job Title', jobTitle);
  127 |         await this.selectDropdownValue('Employment Status', employmentStatus);
  128 |         await this.page.getByRole('button', { name: 'Save' }).click();
  129 |         await expect(this.getDropdownField('Job Title')).toContainText(jobTitle);
  130 |         await expect(this.getDropdownField('Employment Status')).toContainText(employmentStatus);
  131 |     }
  132 | 
  133 |     async updateJobTitle(jobTitle: string) {
  134 |         await this.openJobTab();
  135 |         await this.selectDropdownValue('Job Title', jobTitle);
  136 |         await this.page.getByRole('button', { name: 'Save' }).click();
  137 |         await expect(this.getDropdownField('Job Title')).toContainText(jobTitle);
  138 |     }
  139 | 
  140 |     async updateEmploymentStatus(employmentStatus: string) {
  141 |         await this.openJobTab();
  142 |         await this.selectDropdownValue('Employment Status', employmentStatus);
  143 |         await this.page.getByRole('button', { name: 'Save' }).click();
  144 |         await expect(this.getDropdownField('Employment Status')).toContainText(employmentStatus);
  145 |     }
  146 | 
  147 |     async expectJobDetails(jobTitle: string, employmentStatus: string) {
  148 |         await this.openJobTab();
  149 |         await expect(this.getDropdownField('Job Title')).toContainText(jobTitle);
  150 |         await expect(this.getDropdownField('Employment Status')).toContainText(employmentStatus);
  151 |     }
  152 | 
  153 |     private async openJobTab() {
  154 |         await this.jobTab.click();
  155 |         await expect(this.page.getByText('Job Details', { exact: true })).toBeVisible();
  156 |     }
  157 | 
  158 |     private async selectDropdownValue(label: string, value: string) {
  159 |         const field = this.getDropdownField(label);
  160 |         await field.locator('.oxd-select-text').click();
  161 |         await this.page.locator('.oxd-select-option').getByText(value, { exact: true }).click();
  162 |     }
  163 | 
  164 |     private getDropdownField(label: string) {
  165 |         return this.page.locator('.oxd-input-group').filter({ hasText: label });
  166 |     }
  167 | }
  168 | 
```