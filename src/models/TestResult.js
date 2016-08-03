'use strict';

var SuccessTypes = require('./SuccessTypes.js');

class TestResult {
  constructor() {
    this.testId = -1;
    this.runTick = -1;
    this.testResultId = -1;
    this.success = SuccessTypes.notRun;
  }
}

module.exports = TestResult;

