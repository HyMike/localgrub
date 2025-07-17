import { defineConfig } from "eslint-define-config";
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import eslintPluginPrettier from "eslint-plugin-prettier";
import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";

export default defineConfig({
  ignorePatterns: ["dist"],
  extends: [
    js.configs.recommended,
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react-refresh/recommended",
    "plugin:prettier/recommended",
  ],
  plugins: {
    "@typescript-eslint": typescriptEslintPlugin,
    "react-hooks": reactHooks,
    "react-refresh": reactRefresh,
    prettier: eslintPluginPrettier,
  },
  parser: "@typescript-eslint/parser",
  files: ["**/*.{ts,tsx}"],
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser,
  },
  rules: {
    "prettier/prettier": "error",
  },
});
