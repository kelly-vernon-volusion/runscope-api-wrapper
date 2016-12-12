export class TestResultTimeFrame {

  /**
   *
   * @param {string} name
   * @param {string} id
   * @param {TestResult} previousTestResult
   * @param {TestResult} currentTestResult {TestResult}
   * @param {string} uri
   */
  constructor(name, id, previousTestResult, currentTestResult, uri) {
    this.id = id;
    this.name = name;
    this.previousTestResult = previousTestResult;
    this.currentTestResult = currentTestResult;
    this.uri = uri;
  }
}
