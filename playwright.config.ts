import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    timeout: 60000,
    use: {
        baseURL: process.env.BASE_URL || 'http://localhost:3005',
        trace: 'on-first-retry',
    },
    projects: [
        { name: 'setup', testMatch: /.*\.setup\.ts/ },
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                storageState: 'e2e/.auth/user.json',
            },
            dependencies: ['setup'],
        },
    ],
    webServer: process.env.SKIP_WEBSERVER ? undefined : {
        command: 'npm run dev',
        url: 'http://localhost:3005',
        reuseExistingServer: !process.env.CI,
    },
});
