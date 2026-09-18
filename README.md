# OrangeHRM Playwright

Playwright test automation starter project for the OrangeHRM demo application.

## Setup

```bash
npm install
npx playwright install
```

## Run tests

```bash
npm test
npm run test:headed
npm run test:report
```

The default base URL is `https://opensource-demo.orangehrmlive.com`.

Test artifacts are stored in `artifacts/videos/`, and the HTML report is stored in
`artifacts/html-report/`. Both folders are intentionally included for repository submission.

Employee test data is maintained in `data/employee.json`. Each employee record is
used to generate a separate test, and OrangeHRM generates the Employee ID automatically.

The edit employee test creates an employee, captures the latest backend-generated
Employee ID, searches that ID in Employee List, and then edits the employee's job details.

The add and edit scenarios run serially. One data-driven employee record is created,
its single backend-generated Employee ID is shared by three edit tests, and no
Employee ID is hardcoded.
