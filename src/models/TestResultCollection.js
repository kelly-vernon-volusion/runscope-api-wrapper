'use strict';

let BucketInfo = require('./BucketInfo.js');

class TestResultCollection {
  constructor() {
    this.bucketInfo = new BucketInfo();
    this.testData = [];
  }
}

module.exports = TestResultCollection;
