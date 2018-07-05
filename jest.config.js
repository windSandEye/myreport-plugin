module.exports = {
  globals: {
    'ts-jest': {
      tsConfigFile: './tsconfig.jest.json',
    },
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '/test/.*\\.test\\.tsx?$',
  browser: true,
  // setupFiles: ['./test/environment.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts}',
  ],
};
