const rp = require('request-promise');

class RunscopeWrapperService {
  constructor() {
    this.getHeaders = (token) => {
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      };
    };
  }

  getMainInfo(token) {
    return rp({
      uri: 'https://api.runscope.com/',
      headers: this.getHeaders(token),
      resolveWithFullResponse: true
    });
  }

  getBuckets(token) {
    return rp({
      uri: 'https://api.runscope.com/buckets',
      headers: this.getHeaders(token),
      resolveWithFullResponse: true
    });
  }

  getBucketPageUri(bucketId) {
    return `https://www.runscope.com/radar/${bucketId}`;
  }

  getBucketUri(bucketId) {
    return `https://api.runscope.com/buckets/${bucketId}`;
  }

  getBucketTestsLists(token, bucketId) {
    return rp({
      uri: `${this.getBucketUri(bucketId)}/tests?count=1000`,
      headers: this.getHeaders(token),
      resolveWithFullResponse: true
    });
  }

  getTestInformationInBucket(token, bucketId, testId) {
    return rp({
      uri: this.getTestInformationInBucketUri(bucketId, testId),
      headers: this.getHeaders(token),
      resolveWithFullResponse: true
    });
  }

  getTestResultsInBucketPageUri(bucketId, testId) {
    return `${this.getBucketPageUri(bucketId)}/${testId}/overview`;
  }

  getTestInformationInBucketUri(bucketId, testId) {
    return `${this.getBucketUri(bucketId)}/tests/${testId}`;
  }

  getTestResultsForTestInBucketUri(bucketId, testId) {
    return `${this.getBucketUri(bucketId)}/tests/${testId}/results`;
  }

  getTestResultByIdInBucketUri(bucketId, testId, testResultId) {
    return `${this.getTestResultsForTestInBucketUri(bucketId, testId)}/${testResultId}`;
  }

  getTestResultsForTestInBucket(token, bucketId, testId) {
    return rp({
      uri: this.getTestResultsForTestInBucketUri(bucketId, testId),
      headers: this.getHeaders(token),
      resolveWithFullResponse: true
    });
  }

  getTestResultByResultId(token, bucketId, testId, testResultId) {
    return rp({
      uri: this.getTestResultByIdInBucketUri(bucketId, testId, testResultId),
      headers: this.getHeaders(token),
      resolveWithFullResponse: true
    });
  }

  /**
   *
   * @param token
   * @param bucketId
   * @param testId
   * @returns {Promise<object>}
   */
  getLatestTestResultsInBucket(token, bucketId, testId) {
    return rp({
      uri: this.getTestResultByIdInBucketUri(bucketId, testId, 'latest'),
      headers: this.getHeaders(token),
      resolveWithFullResponse: true
    });
  }
}

module.exports = RunscopeWrapperService;
