const BucketInfo = require('./BucketInfo.js').BucketInfo;

export class TestResultCollection {
  constructor() {
    this.bucketInfo = new BucketInfo();
    this.testData = [];
  }
}
