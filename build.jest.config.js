module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/tests/build/**/*.test.{js,ts}',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
  coverageDirectory: './coverage/build',
  collectCoverageFrom: [
    '<rootDir>/lib/**/*.js',
  ],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.jest.json',
      },
    ],
  },
};
