const { defineConfig } = require("@playwright/test");

const port = Number(process.env.TEST_PORT || 4173);
module.exports = defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.cjs",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  timeout: 45000,
  expect: { timeout: 10000 },
  outputDir: ".test-artifacts/test-results",
  reporter: [["list"], ["html", { outputFolder: ".test-artifacts/report", open: "never" }]],
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop-light", use: { viewport: { width: 1280, height: 900 }, colorScheme: "light" } },
    { name: "desktop-dark", use: { viewport: { width: 1280, height: 900 }, colorScheme: "dark" } },
    { name: "mobile-light", use: { viewport: { width: 390, height: 844 }, colorScheme: "light" } },
    { name: "mobile-dark", use: { viewport: { width: 390, height: 844 }, colorScheme: "dark" } },
  ],
  webServer: {
    command: "node _scripts/serve-built-site.cjs",
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: false,
    timeout: 30000,
    env: { SITE_BUILD_DIR: process.env.SITE_BUILD_DIR || ".test-artifacts/site" },
  },
});
