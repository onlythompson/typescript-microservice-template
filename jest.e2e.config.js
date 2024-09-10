module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['<rootDir>/tests/e2e/**/*.(test|spec).[jt]s?(x)'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    // setupFilesAfterEnv: ['./setup.ts'],
    // globalSetup: './globalSetup.js',
    // globalTeardown: './globalTeardown.js',
    testTimeout: 30000,
}