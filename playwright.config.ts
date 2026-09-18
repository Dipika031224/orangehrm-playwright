/// <reference types="node" />

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',

    fullyParallel: false,

    forbidOnly: !!process.env.CI,

    retries: process.env.CI ? 2 : 0,

    workers: 1,

    reporter: [
        ['html', { outputFolder: 'artifacts/html-report', open: 'never' }]
    ],

    outputDir: 'artifacts/videos',

    use: {
        baseURL: 'https://opensource-demo.orangehrmlive.com',

        trace: 'on-first-retry',

        video: 'on',

        screenshot: 'only-on-failure',

        headless: true
    },

    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome']
            }
        }
    ]
});