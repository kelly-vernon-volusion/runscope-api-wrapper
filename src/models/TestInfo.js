'use strict';
var SuccessTypes = require('./SuccessTypes.js');
var TestResult = require('./TestResult.js');

class TestInfo {
  constructor(name, id, schedules, success, uri) {
    this.name = name;
    this.results = [];
    this.id = id;
    this.schedules = schedules;
    this.success = success;
    this.uri = uri;
  }

  getHasSchedules() {
    return !(this.schedules === undefined || this.schedules === null || this.schedules.length === 0);
  }

  getResultsByDescTick() {
    if (this.results === undefined || this.results === null || this.results.length === 0) {
      return [];
    }

    var ascSort = (a, b) => {
      return a.runTick < b.runTick;
    };

    return this.results.sort(ascSort);
  }

  getMostPreviousResult() {
    var results = this.getResultsByDescTick();

    if (results.length <= 1){
      return new TestResult();
    }

    return results[1];
  }

  getLatestResult() {
    var results = this.getResultsByDescTick();

    if (results.length == 0){
      return new TestResult();
    }

    return results[0];
  }
}

module.exports = TestInfo;
