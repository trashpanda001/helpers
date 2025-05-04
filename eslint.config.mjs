import js from "@eslint/js"
import perfectionist from "eslint-plugin-perfectionist"
import react from "eslint-plugin-react"
import unusedImports from "eslint-plugin-unused-imports"
import { defineConfig, globalIgnores } from "eslint/config"
import tseslint from "typescript-eslint"

const eslintConfig = defineConfig([
  // ignore dist/ and explicitly include file extensions we want
  globalIgnores(["dist/", "docs/"]),
  { files: ["**/*.{cjs,cts,js,jsx,mjs,mts,ts,tsx}"] },

  // @eslint/js recommended
  {
    extends: ["js/recommended"],
    plugins: {
      js,
    },
    rules: {
      curly: ["error", "all"],
      "no-constant-condition": "warn",
      "no-param-reassign": "error",
      "no-restricted-imports": ["error", { patterns: ["../*"] }],
      //"no-use-before-define": ["error", { functions: false }],
    },
  },

  // tseslint recommended
  {
    extends: ["tseslint/recommended"],
    plugins: {
      tseslint,
    },
  },

  // eslint-plugin-perfectionist
  {
    extends: [perfectionist.configs["recommended-natural"]],
    rules: {
      "perfectionist/sort-imports": "off", // handled by prettier-plugin-sort-imports
      "perfectionist/sort-named-imports": "off", // handled by prettier-plugin-sort-imports
    },
  },

  // eslint-plugin-unused-imports
  {
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }], // allow _unused
    },
  },

  // React and TSX support
  {
    files: ["**/*.{jsx,tsx}"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaFeatures: { jsx: true },
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: { react },
    extends: ["plugin:react/recommended", "plugin:react/jsx-runtime"],
    settings: {
      react: { version: "detect" },
    },
  },
])

export default eslintConfig
