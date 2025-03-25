import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import * as lit from "eslint-plugin-lit";
import n from "eslint-plugin-n";
import * as wc from "eslint-plugin-wc";
import unicorn from "eslint-plugin-unicorn";

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
      "unicorn/new-for-builtins": ["off"],
      "unicorn/no-array-callback-reference": ["off"],
      "unicorn/no-array-for-each": ["off"],
      "unicorn/no-await-expression-member": ["off"],
      "unicorn/no-lonely-if": ["off"],
      "unicorn/no-negated-condition": ["off"],
      "unicorn/no-null": ["off"],
      "unicorn/no-useless-spread": ["off"],
      "unicorn/no-useless-undefined": ["off"],
      "unicorn/numeric-separators-style": ["off"],
      "unicorn/prefer-at": ["off"],
      "unicorn/prefer-date-now": ["off"],
      "unicorn/prefer-global-this": ["off"],
      "unicorn/prefer-includes": ["off"],
      "unicorn/prefer-query-selector": ["off"],
      "unicorn/prefer-set-has": ["off"],
      "unicorn/prefer-spread": ["off"],
      "unicorn/prefer-string-replace-all": ["off"],
      "unicorn/prefer-string-slice": ["off"],
      "unicorn/prefer-ternary": ["off"],
      "unicorn/prefer-top-level-await": ["off"],
      "unicorn/prevent-abbreviations": ["off"],
      "unicorn/switch-case-braces": ["off"],
      "unicorn/template-indent": ["off"],
      "unicorn/text-encoding-identifier-case": ["off"],
      "unicorn/throw-new-error": ["off"],
      "unicorn/catch-error-name": ["off"],
    },
  },
]);
