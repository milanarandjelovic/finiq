import { nextJsConfig } from '@finiq/eslint-config/next-js'

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextJsConfig,
  {
    // next.config.js, instrumentation.ts and sentry config files run in Node.js.
    // Declare `process` so ESLint does not report it as undefined.
    files: ['*.js', '*.mjs', 'instrumentation.ts', 'sentry.*.config.ts'],
    languageOptions: {
      globals: {
        process: 'readonly',
      },
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'react/prop-types': 'off',
    },
  },
]
