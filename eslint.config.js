import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import prettierConfig from "eslint-config-prettier/flat";
// @ts-ignore
import importPlugin from "eslint-plugin-import";
import * as lit from "eslint-plugin-lit";
import n from "eslint-plugin-n";
import unicorn from "eslint-plugin-unicorn";
import * as wc from "eslint-plugin-wc";
import globals from "globals";

export default defineConfig([
  n.configs["flat/recommended"],
  wc.configs["flat/best-practice"],
  lit.configs["flat/all"],
  unicorn.configs["recommended"],
  { files: ["**/*.{js,mjs,cjs}"] },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    rules: {
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "n/no-unsupported-features/node-builtins": ["off"],
      "unicorn/prevent-abbreviations": ["off"],
      "unicorn/template-indent": ["off"],
    },
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { import: importPlugin },
    rules: {
      "sort-imports": "off",
      "import/order": [
        "error",
        {
          alphabetize: {
            order: "asc",
          },
          named: true,
          "newlines-between": "always-and-inside-groups",
        },
      ],
    },
  },
  prettierConfig,
]);
