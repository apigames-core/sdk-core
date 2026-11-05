module.exports = {
  coverageDirectory: './coverage',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,js}',
    '!<rootDir>/src/**/*.d.ts',
  ],
  modulePaths: ['<rootDir>/src'],
  testEnvironment: 'node',
  testMatch: [
    '**/tests/dev/**/*.test.ts',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.jest.json',
      },
    ],
  },
};
