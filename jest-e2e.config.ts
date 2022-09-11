import jestConfig from './jest.config';

export default {
  ...jestConfig,
  displayName: 'end2end-tests',
  testEnvironment: './prisma/prisma-test-environment.ts',
  testRegex: '.e2e-spec.ts$',
};
