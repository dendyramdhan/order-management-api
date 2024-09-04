module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/*.test.ts'], // Look for test files with `.test.ts` suffix
    moduleFileExtensions: ['ts', 'js'],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
    },
    setupFiles: ['dotenv/config'], // Load environment variables from .env file
  };
  