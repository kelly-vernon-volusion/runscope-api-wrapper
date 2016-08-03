'use strict';
let Promise = require('bluebird');

let TestInfo = require('./../models/TestInfo.js');
let TestResult = require('./../models/TestResult.js');
let BucketInfo = require('./../models/BucketInfo.js');
let TestResultCollection = require('./../models/TestResultCollection.js');
let TestResultTimeFrame = require('./../models/TestResultTimeFrame.js');
let SuccessTypes = require('./../models/SuccessTypes.js');

let RunscopeWrapperService = require('./RunscopeWrapperService');

let service = new RunscopeWrapperService();

class ApiMonitorService {
  static findByName(dataArray, bucketName) {
    if (dataArray === undefined || dataArray === null || dataArray.length === 0 ||
      bucketName === undefined || bucketName === null || bucketName === '') {
      return null;
    }

    for (let i = 0; i < dataArray.length; i++) {
      let item = dataArray[i];
      if (item.name.toLowerCase() === bucketName.toLowerCase()) {
        return item;
      }
    }

    return null;
  }

  static isMatch(testInfo, testResult) {
    //console.log(currentTestResult);
    //console.log(currentTestResult);
    let isUndefinedOrNull = (value) => {
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
    let testInfo = new TestInfo(
      testData.name,
      testData.id,
      testData.schedules,
      SuccessTypes.notRun,
      service.getTestResultsInBucketPageUri(bucketId, testData.id)
    );

    return testInfo;
  }

  convertToTestResult(testResultData) {
    let testResult = new TestResult();
    testResult.testId = testResultData.test_id;
    testResult.testResultId = testResultData.test_run_id;
    testResult.success = testResultData.result;
    testResult.runTick = testResultData.started_at;

    return testResult;
  }

  convertToTestResultCollection(testResultDataCollection) {
    let collection = [];

    if (testResultDataCollection === undefined || testResultDataCollection === null || testResultDataCollection.length === 0) {
      return collection;
    }

    for (let i = 0; i < testResultDataCollection.length; i++) {
      collection.push(this.convertToTestResult(testResultDataCollection[i]));
    }

    return collection;
  }

  convertToTestInfoCollection(bucketId, testsDataCollection) {
    let collection = [];

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
        let data = JSON.parse(response.body).data;

        let collection = [];
        for (let i = 0; i < data.length; i++) {
          collection.push(new BucketInfo(
            data[i].name,
            data[i].key,
            service.getBucketPageUri(data[i].key)));
        }

        return Promise.resolve(collection);
      }).catch((error) => {
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
      let data = JSON.parse(response.body).data;
      let testInfoCollection = this.convertToTestInfoCollection(bucketId, data);
      return Promise.resolve(testInfoCollection);
    }).catch(function (error) {
      return Promise.reject(error);
    });
  };

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
        let data = JSON.parse(response.body).data;

        let testInfo = this.convertToTestInfo(bucketId, data);
        console.log(testInfo);
        return Promise.resolve(testInfo);
      }).catch((error) => {
        return Promise.reject(error);
      });
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
        let dataTestResultCollection = JSON.parse(response.body).data;
        console.log(dataTestResultCollection);

        let testInfo = this.convertToTestResultCollection(dataTestResultCollection);
        return Promise.resolve(testInfo);
      }).catch(error => {
        return Promise.reject(error);
      });
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

    let testResult = new TestResult();
    testResult.testId = testId;

    return service.getLatestTestResultsInBucket(token, bucketId, testId)
      .then(response => {
        let data = JSON.parse(response.body).data;

        //console.log(data);
        testResult.success = data.result;

        return Promise.resolve(testResult);
      }).catch(error => {
        testResult.success = SuccessTypes.runscopeServerError;
        return Promise.resolve(testResult);
      });
  };

  /**
   *
   * @param token
   * @param bucketId
   * @param dataIdsOnly
   * @returns {Promise<Array<Array<TestResult>>>}
   */
  getAllTestResultsForTestInBucketByTestIds(token, bucketId, dataIdsOnly) {
    let promises = [];

    if (dataIdsOnly === undefined || dataIdsOnly === null || dataIdsOnly.length === 0) {
      return Promise.resolve(promises);
    }

    for (let i = 0; i < dataIdsOnly.length; i++) {
      promises.push(this.getTestResultsForTestInBucket(token, bucketId, dataIdsOnly[i]));
    }

    return Promise.all(promises);
  };

  /**
   *
   * @param token
   * @param bucketId
   * @param dataIdsOnly
   * @returns {Promise<Array<TestInfo>>}
   */
  getAllTestInformationInBucketByTestIds(token, bucketId, dataIdsOnly) {
    let promises = [];

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
        let dataIdsOnly = [];

        for (let d = 0; d < testsInBucketCollection.length; d++) {
          dataIdsOnly.push(testsInBucketCollection[d].id);
        }

        return this.getAllTestInformationInBucketByTestIds(token, bucketId, dataIdsOnly)
          .then(testInfoCollection => {
            console.log(testInfoCollection);
            return this.getAllTestResultsForTestInBucketByTestIds(token, bucketId, dataIdsOnly)
              .then(testDataResultsCollection => {
                console.log(testDataResultsCollection);
                for (let i = 0; i < testInfoCollection.length; i++) {
                  for (let w = 0; w < testDataResultsCollection.length; w++) {
                    let testResultCollectionGroup = testDataResultsCollection[w];
                    console.log(testResultCollectionGroup);
                    for (let ww = 0; ww < testResultCollectionGroup.length; ww++) {
                      if (testInfoCollection[i].id === testResultCollectionGroup[ww].testId) {
                        testInfoCollection[i].results.push(testResultCollectionGroup[ww]);
                      }
                    }
                  }
                }

                return Promise.resolve(testInfoCollection);
              }).catch((error) => {
                return Promise.reject(error);
              });
          }).catch((error) => {
            return Promise.reject(error);
          });
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
      let bucketInfo = ApiMonitorService.findByName(data, bucketName);

      if (bucketInfo === null) {
        return Promise.reject(new Error(`cannot find a match for '${bucketName}'`));
      }

      return this.getMostRecentResultsOfAllTestsInBucket(token, bucketInfo.id)
        .then(testInfoCollection=> {

          let resultForTestCollection = new TestResultCollection();
          resultForTestCollection.bucketInfo = bucketInfo;

          for (let i = 0; i < testInfoCollection.length; i++) {
            let testInfo = testInfoCollection[i];

            resultForTestCollection.testData.push(testInfo);
          }

          return Promise.resolve(resultForTestCollection);
        }).catch((error) => {
          return Promise.reject(error);
        });
    }).catch((error)=> {
      return Promise.reject(error);
    });
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
      .then((testResultCollection) => {
        let resultForTestCollection = new TestResultCollection();
        resultForTestCollection.bucketInfo = testResultCollection.bucketInfo;

        for (let i = 0; i < testResultCollection.testData.length; i++) {
          let testInfo = testResultCollection.testData[i];

          resultForTestCollection.testData.push(new TestResultTimeFrame(
            testInfo.name,
            testInfo.id,
            testInfo.getMostPreviousResult(),
            testInfo.getLatestResult(),
            testInfo.uri));
        }

        return Promise.resolve(resultForTestCollection);
      }).catch((error) => {
        return Promise.reject(error);
      });
  }

  getDate() {
    return new Date();
  }
}

module.exports = ApiMonitorService;
