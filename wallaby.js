module.exports = () => ({
  files: ['src/**/*.js', 'config/*.yaml'],
  tests: ['test/unit/**/*.js'],
  env: {
    type: 'node',
    runner: 'node'
  },
  testFramework: 'mocha'
});
