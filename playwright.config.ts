import { defineConfig, devices } from "@playwright/test";

// Smoke owns its own port and never reuses a server: a reused server would keep
// its own Firebase env, and the "connected" check could pass against a real project.
const PORT = 3100;

export default defineConfig({
  testDir: "e2e",
  reporter: "list",
  use: { baseURL: `http://localhost:${PORT}` },
  projects: [
    { name: "webkit-iphone", use: { ...devices["iPhone 15"] } },
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: `npm run dev -w web -- --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    env: { NEXT_PUBLIC_FIREBASE_EMULATORS: "1" },
    timeout: 120_000,
  },
});
