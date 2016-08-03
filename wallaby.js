module.exports = () => ({
  files: ['src/**/*.js', 'config/*.yaml'],
  tests: ['test/unit/services/RunscopeWrapperServiceTests.js'],
  env: {
    type: 'node',
    runner: 'node'
  },
  testFramework: 'mocha'
});
