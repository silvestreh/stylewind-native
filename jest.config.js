export default {
  preset: 'react-native',
  transform: {
    '^.+\\.(js|jsx|ts|tsx|cjs)$': 'babel-jest',
  },
  setupFiles: ['<rootDir>/jest.setup.js'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|tsx)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'cjs'],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  globals: {
    __DEV__: true,
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|@react-native-community|@testing-library|@react-native/js-polyfills)/)',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
  collectCoverage: true, // Enable coverage collection
  coverageDirectory: 'coverage', // Where to store the coverage reports
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}', // Adjust the path to your source files
    '!src/**/*.d.ts', // Exclude type declaration files
    '!src/**/*.test.{ts,tsx}', // Exclude test files from coverage
  ],
  coverageReporters: ['json', 'lcov', 'text', 'clover'], // Report formats
};
