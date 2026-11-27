import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "unit",
          environment: "node",
          include: ["functions/src/**/*.test.ts", "scripts/**/*.test.mjs"],
        },
      },
      {
        test: {
          name: "rules",
          environment: "node",
          include: ["tests/rules/**/*.test.ts"],
        },
      },
      {
        test: {
          name: "web",
          environment: "node",
          include: ["web/src/**/*.test.ts"],
        },
      },
    ],
  },
});
