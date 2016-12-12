module.exports = (wallaby) => ({
  files: ['src/**/*.js', 'config/*.yaml'],
  tests: ['test/unit/**/*.js'],
  env: {
    type: 'node'
  },
  testFramework: 'mocha',
  compilers: {
    '**/*.js': wallaby.compilers.babel()
  },
  delays: {
    run: 500
  }
});
