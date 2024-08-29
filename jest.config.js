module.exports = {
    // Indicates that this is a TypeScript project
    preset: 'ts-jest',
  
    // Sets the test environment. 'node' is appropriate for backend projects
    testEnvironment: 'node',
  
    // Defines where Jest should look for files
    roots: ['<rootDir>/src', '<rootDir>/tests'],
  
    // Defines the pattern for test files
    testMatch: [
      '**/__tests__/**/*.+(ts|tsx|js)',
      '**/?(*.)+(spec|test).+(ts|tsx|js)'
    ],
  
    // Configures the TypeScript transformer
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
  
    // Sets up module name mapping for easier imports
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
    },
  
    // Configures coverage collection
    collectCoverageFrom: [
      'src/**/*.{js,ts}',
      '!src/**/*.d.ts',
      '!src/index.ts',
    ],
  
    // Sets the coverage threshold
    coverageThreshold: {
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  
    // Defines where to output coverage reports
    coverageDirectory: 'coverage',
  
    // Automatically clear mock calls and instances between every test
    clearMocks: true,
  
    // Indicates whether the coverage information should be collected while executing the test
    collectCoverage: true,
  
    // Files to run before tests are executed
    setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  
    // Sets the maximum number of workers to 4
    maxWorkers: 4,
  
    // Allows for use of modern ECMAScript features
    globals: {
      'ts-jest': {
        useESM: true,
      },
    },
    setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  };