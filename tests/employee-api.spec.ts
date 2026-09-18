import { test, expect } from '@playwright/test';

test.describe('Employee API Validation', () => {

    test('Verify employee details through API', async ({ request }) => {

        const response = await request.get(
            'https://reqres.in/api/users/2'
        );

        expect(
            response.status(),
            'API should return HTTP 200'
        ).toBe(200);

        const responseBody = await response.json();

        console.log('API Response:', responseBody);

        expect(
            responseBody.data,
            'API response should contain user data'
        ).toBeDefined();

        expect(
            responseBody.data.id,
            'Employee/User ID should be available'
        ).toBe(2);

    });

});