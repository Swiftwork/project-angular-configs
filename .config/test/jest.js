module.exports = {
  rootDir: '../../',
  preset: 'jest-preset-angular',
  setupTestFrameworkScriptFile: '<rootDir>/src/setupJest.ts',
  globals: {
    VERSION: new Date().toISOString(),
    __TRANSFORM_HTML__: true,
    'ts-jest': {
      tsConfigFile: 'src/tsconfig.spec.json',
    },
  },
};
