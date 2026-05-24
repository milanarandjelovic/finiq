/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest'

const config: Config = {
  // A preset that is used as a base for Jest's configuration
  preset: 'ts-jest',

  // The test environment that will be used for testing
  testEnvironment: 'node',

  // The root directory that Jest should scan for tests and modules within
  rootDir: 'src',

  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: [
    '**/*.ts',
    '!**/*.spec.ts',
    '!**/*.module.ts',
    '!**/*.interface.ts',
    '!**/*.dto.ts',
    '!**/*.entity.ts',
    '!**/*.enum.ts',
    '!**/*.decorator.ts',
    '!**/*.d.ts',
    '!**/migrations/**',
    '!**/seeders/**',
    '!**/factories/**',
    '!**/node_modules/**',
    '!**/main.ts',
    '!**/providers/db/**',
  ],

  // The directory where Jest should output its coverage files
  coverageDirectory: '../coverage',

  // An array of regexp pattern strings used to skip a coverage collection
  coveragePathIgnorePatterns: ['/node_modules/'],

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',

  // An array of file extensions your modules use
  moduleFileExtensions: ['js', 'json', 'ts'],

  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },

  // The glob patterns Jest uses to detect test files
  testMatch: ['**/*.spec.ts'],

  // A map from regular expressions to paths to transformers
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },

  // In bun's cache, paths look like: node_modules/.bun/pkg@version/node_modules/pkg/file.js
  // The inner /node_modules/ is always preceded by a version string containing @.
  // This pattern ignores node_modules/ except:
  //   - the outer bun cache root (.bun/ prefix)
  //   - the inner nested path (@ prefix from version string)
  // Result: all ESM packages stored in bun's .bun/ cache get transformed by ts-jest.
  transformIgnorePatterns: ['(?<!@[^/]+)/node_modules/(?!\\.bun/)'],

  // Indicates whether each individual test should be reported during the run
  verbose: true,

  // An object that configures minimum threshold enforcement for coverage results
  coverageThreshold: {
    global: { branches: 80, functions: 80, lines: 80, statements: 80 },
  },
}

export default config
