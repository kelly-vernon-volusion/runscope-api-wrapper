const SuccessTypes = require('./SuccessTypes.js').SuccessTypes;

export class TestResult {
  constructor() {
    this.testId = -1;
    this.runTick = -1;
    this.testResultId = -1;
    this.success = SuccessTypes.notRun;
  }
}
