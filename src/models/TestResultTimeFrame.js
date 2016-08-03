'use strict';

var SuccessTypes = require('./SuccessTypes.js');

class TestResultTimeFrame {

  /**
   *
   * @param name {string}
   * @param id {string}
   * @param previousTestResult {TestResult}
   * @param currentTestResult {TestResult}
   * @param uri {string}
   */
  constructor(name, id, previousTestResult, currentTestResult, uri) {
    this.id = id;
    this.name = name;
    this.previousTestResult = previousTestResult;
    this.currentTestResult = currentTestResult;
    this.uri = uri;
  }
}

module.exports = TestResultTimeFrame;
