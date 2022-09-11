export default {
  clearMocks: true,
  coverageProvider: "v8",
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts(x)'],
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest"],
  },
};
