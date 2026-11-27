import js from "@eslint/js";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores([
    "web/**",
    "functions/**",
    "node_modules/**",
    "test-results/**",
    "playwright-report/**",
    ".firebase/**",
  ]),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["scripts/**/*.mjs"],
    languageOptions: { globals: { console: "readonly", process: "readonly" } },
  },
]);
