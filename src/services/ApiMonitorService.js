const Promise = require('bluebird');

const TestInfo = require('./../models/TestInfo.js');
const TestResult = require('./../models/TestResult.js');
const BucketInfo = require('./../models/BucketInfo.js');
const TestResultCollection = require('./../models/TestResultCollection.js');
const TestResultTimeFrame = require('./../models/TestResultTimeFrame.js');
const SuccessTypes = require('./../models/SuccessTypes.js');

const RunscopeWrapperService = require('./RunscopeWrapperService');

const service = new RunscopeWrapperService();

class ApiMonitorService {
  static findByName(dataArray, bucketName) {
    if (dataArray === undefined || dataArray === null || dataArray.length === 0 ||
      bucketName === undefined || bucketName === null || bucketName === '') {
      return null;
    }

    for (let i = 0; i < dataArray.length; i++) {
      const item = dataArray[i];
      if (item.name.toLowerCase() === bucketName.toLowerCase()) {
        return item;
      }
    }

    return null;
  }

  static isMatch(testInfo, testResult) {
    //console.log(currentTestResult);
    //console.log(currentTestResult);
    const isUndefinedOrNull = (value) => {
      return value === undefined || value === null;
    };

    if (isUndefinedOrNull(testInfo) && isUndefinedOrNull(testResult)) {
      return true;
    }

    if (isUndefinedOrNull(testInfo) !== isUndefinedOrNull(testResult)) {
      return false;
    }

    return testInfo.id === testResult.testId;
  }

  convertToTestInfo(bucketId, testData) {
    const testInfo = new TestInfo(
      testData.name,
      testData.id,
      testData.schedules,
      SuccessTypes.notRun,
      service.getTestResultsInBucketPageUri(bucketId, testData.id)
    );

    return testInfo;
  }

  convertToTestResult(testResultData) {
    const testResult = new TestResult();
    testResult.testId = testResultData.test_id;
    testResult.testResultId = testResultData.test_run_id;
    testResult.success = testResultData.result;
    testResult.runTick = testResultData.started_at;

    return testResult;
  }

  convertToTestResultCollection(testResultDataCollection) {
    const collection = [];

    if (testResultDataCollection === undefined || testResultDataCollection === null || testResultDataCollection.length === 0) {
      return collection;
    }

    for (let i = 0; i < testResultDataCollection.length; i++) {
      collection.push(this.convertToTestResult(testResultDataCollection[i]));
    }

    return collection;
  }

  convertToTestInfoCollection(bucketId, testsDataCollection) {
    const collection = [];

    if (testsDataCollection === undefined || testsDataCollection === null || testsDataCollection.length === 0) {
      return collection;
    }

    for (let i = 0; i < testsDataCollection.length; i++) {
      collection.push(this.convertToTestInfo(bucketId, testsDataCollection[i]));
    }

    return collection;
  }

  /**
   *
   * @param token
   * @returns {Promise<Array<BucketInfo>>}
   */
  getBuckets(token) {
    if (service === null || token === undefined || token === null) {
      return Promise.reject(new Error('token is invalid. Please make sure it is populated with a string.'));
    }

    return service.getBuckets(token)
      .then(response => {
        const data = JSON.parse(response.body).data;

        const collection = [];
        for (let i = 0; i < data.length; i++) {
          collection.push(new BucketInfo(
            data[i].name,
            data[i].key,
            service.getBucketPageUri(data[i].key)));
        }

        return Promise.resolve(collection);
      }).catch(error => {
        return Promise.reject(error);
      });
  }

  /**
   *
   * @param token
   * @param bucketId
   * @returns {Promise<Array<TestInfo>>}
   */
  getBucketTestsLists(token, bucketId) {
    if (service === null ||
      token === undefined || token === null ||
      bucketId === undefined || bucketId === null) {
      return Promise.reject(new Error('token or bucketId is invalid. Please make sure these are populated with strings.'));
    }

    return service.getBucketTestsLists(token, bucketId).then(response => {
      const data = JSON.parse(response.body).data;
      const testInfoCollection = this.convertToTestInfoCollection(bucketId, data);
      return Promise.resolve(testInfoCollection);
    }).catch(error => Promise.reject(error));
  }

  /**
   *
   * @param token
   * @param bucketId
   * @param testId
   * @returns {Promise<TestInfo>}
   */
  getTestInformationInBucket(token, bucketId, testId) {
    if (service === null ||
      token === undefined || token === null ||
      testId === undefined || testId === null ||
      bucketId === undefined || bucketId === null) {
      return Promise.reject(new Error('token, bucketId, or testId is invalid. Please make sure these are populated with strings.'));
    }

    return service.getTestInformationInBucket(token, bucketId, testId)
      .then(response => {
        const data = JSON.parse(response.body).data;

        const testInfo = this.convertToTestInfo(bucketId, data);
        return Promise.resolve(testInfo);
      }).catch(error => Promise.reject(error));
  }

  /**
   *
   * @param token
   * @param bucketId
   * @param testId
   * @returns {Promise<Array<TestResult>>}
   */
  getTestResultsForTestInBucket(token, bucketId, testId) {
    if (service === null ||
      token === undefined || token === null ||
      testId === undefined || testId === null ||
      bucketId === undefined || bucketId === null) {
      return Promise.reject(new Error('token, bucketId, or testId is invalid. Please make sure these are populated with strings.'));
    }

    return service.getTestResultsForTestInBucket(token, bucketId, testId)
      .then(response => {
        const dataTestResultCollection = JSON.parse(response.body).data;
        const testInfo = this.convertToTestResultCollection(dataTestResultCollection);
        return Promise.resolve(testInfo);
      }).catch(error => Promise.reject(error));
  }

  /**
   *
   * @param token
   * @param bucketId
   * @param testId
   * @returns {Promise<TestResult>}
   */
  getLatestTestResultInBucket(token, bucketId, testId) {
    if (service === null ||
      token === undefined || token === null ||
      testId === undefined || testId === null ||
      bucketId === undefined || bucketId === null) {
      return Promise.reject(new Error('token, bucketId, or testId is invalid. Please make sure these are populated with strings.'));
    }

    const testResult = new TestResult();
    testResult.testId = testId;

    return service.getLatestTestResultsInBucket(token, bucketId, testId)
      .then(response => {
        const data = JSON.parse(response.body).data;
        testResult.success = data.result;

        return Promise.resolve(testResult);
      }).catch(() => {
        testResult.success = SuccessTypes.runscopeServerError;
        return Promise.resolve(testResult);
      });
  }

  /**
   *
   * @param token
   * @param bucketId
   * @param dataIdsOnly
   * @returns {Promise<Array<Array<TestResult>>>}
   */
  getAllTestResultsForTestInBucketByTestIds(token, bucketId, dataIdsOnly) {
    const promises = [];

    if (dataIdsOnly === undefined || dataIdsOnly === null || dataIdsOnly.length === 0) {
      return Promise.resolve(promises);
    }

    for (let i = 0; i < dataIdsOnly.length; i++) {
      promises.push(this.getTestResultsForTestInBucket(token, bucketId, dataIdsOnly[i]));
    }

    return Promise.all(promises);
  }

  /**
   *
   * @param token
   * @param bucketId
   * @param dataIdsOnly
   * @returns {Promise<Array<TestInfo>>}
   */
  getAllTestInformationInBucketByTestIds(token, bucketId, dataIdsOnly) {
    const promises = [];

    if (dataIdsOnly === undefined || dataIdsOnly === null || dataIdsOnly.length === 0) {
      return Promise.resolve(promises);
    }

    for (let i = 0; i < dataIdsOnly.length; i++) {
      promises.push(this.getTestInformationInBucket(token, bucketId, dataIdsOnly[i]));
    }

    return Promise.all(promises);
  }

  /**
   *
   * @param token
   * @param bucketId
   * @returns {Promise<Array<TestInfo>>}
   */
  getMostRecentResultsOfAllTestsInBucket(token, bucketId) {
    if (service === null ||
      token === undefined || token === null ||
      bucketId === undefined || bucketId === null) {
      return Promise.reject(new Error('token or bucketId is invalid. Please make sure these are populated with strings.'));
    }

    return this.getBucketTestsLists(token, bucketId)
      .then(testsInBucketCollection => {
        const dataIdsOnly = [];

        for (let d = 0; d < testsInBucketCollection.length; d++) {
          dataIdsOnly.push(testsInBucketCollection[d].id);
        }

        return this.getAllTestInformationInBucketByTestIds(token, bucketId, dataIdsOnly)
          .then(testInfoCollection => {
            return this.getAllTestResultsForTestInBucketByTestIds(token, bucketId, dataIdsOnly)
              .then(testDataResultsCollection => {
                for (let i = 0; i < testInfoCollection.length; i++) {
                  for (let w = 0; w < testDataResultsCollection.length; w++) {
                    const testResultCollectionGroup = testDataResultsCollection[w];
                    for (let ww = 0; ww < testResultCollectionGroup.length; ww++) {
                      if (testInfoCollection[i].id === testResultCollectionGroup[ww].testId) {
                        testInfoCollection[i].results.push(testResultCollectionGroup[ww]);
                      }
                    }
                  }
                }

                return Promise.resolve(testInfoCollection);
              }).catch(error => Promise.reject(error));
          }).catch(error => Promise.reject(error));
      });
  }

  /**
   *
   * @param token
   * @param bucketName {String}
   * @returns  {Promise<TestResultCollection>};
   */
  getMostRecentResultsOfAllTestsInBucketByName(token, bucketName) {
    if (service === null ||
      token === undefined || token === null ||
      bucketName === undefined || bucketName === null) {
      return Promise.reject(new Error('token or bucketName is invalid. Please make sure these are populated with strings.'));
    }

    return this.getBuckets(token).then((data) => {
      const bucketInfo = ApiMonitorService.findByName(data, bucketName);

      if (bucketInfo === null) {
        return Promise.reject(new Error(`cannot find a match for '${bucketName}'`));
      }

      return this.getMostRecentResultsOfAllTestsInBucket(token, bucketInfo.id)
        .then(testInfoCollection => {
          const resultForTestCollection = new TestResultCollection();
          resultForTestCollection.bucketInfo = bucketInfo;

          for (let i = 0; i < testInfoCollection.length; i++) {
            const testInfo = testInfoCollection[i];

            resultForTestCollection.testData.push(testInfo);
          }

          return Promise.resolve(resultForTestCollection);
        }).catch(error => Promise.reject(error));
    }).catch(error => Promise.reject(error));
  }

  /**
   *
   * @param token
   * @param bucketName {String}
   * @returns  {Promise<TestResultCollection>};
   */
  getTimeFrameOfTestsInBucketByName(token, bucketName) {
    if (service === null ||
      token === undefined || token === null ||
      bucketName === undefined || bucketName === null) {
      return Promise.reject('token or bucketName is invalid. Please make sure these are populated with strings.');
    }

    return this.getMostRecentResultsOfAllTestsInBucketByName(token, bucketName)
      .then(testResultCollection => {
        const resultForTestCollection = new TestResultCollection();
        resultForTestCollection.bucketInfo = testResultCollection.bucketInfo;

        for (let i = 0; i < testResultCollection.testData.length; i++) {
          const testInfo = testResultCollection.testData[i];

          resultForTestCollection.testData.push(new TestResultTimeFrame(
            testInfo.name,
            testInfo.id,
            testInfo.getMostPreviousResult(),
            testInfo.getLatestResult(),
            testInfo.uri));
        }

        return Promise.resolve(resultForTestCollection);
      }).catch(error => Promise.reject(error));
  }

  getDate() {
    return new Date();
  }
}

module.exports = ApiMonitorService;
