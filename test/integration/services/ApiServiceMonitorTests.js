const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const ApiMonitorService = require('../../../src/services/ApiMonitorService.js');
const BucketInfo = require('../../../src/models/BucketInfo.js');
const TestInfo = require('../../../src/models/TestInfo.js');
const TestResult = require('../../../src/models/TestResult.js');
const TestResultTimeFrame = require('../../../src/models/TestResultTimeFrame.js');

const versionTestId = process.env.versionTestId;
const token = process.env.token;
const bucketId = process.env.bucketId;
const bucketName = process.env.bucketName;
const triggerId = process.env.triggerId;
const triggerUri = process.env.triggerUri;

describe('ApiServiceMonitor', function () {
  this.timeout(2000);

  let apiMonitor;

  beforeEach(() => {
    apiMonitor = new ApiMonitorService();
  });

  describe('and getting buckets', function () {
    it('when populated', () => {
      return apiMonitor.getBuckets(token)
        .then(data => {
          expect(data.length).to.be.greaterThan(0);

          expect(data[0] instanceof BucketInfo).to.equal(true);
          expect(data[0].isNew()).to.equal(false);
        })
        .catch(error => expect(error).to.be.null);
    });
  });

  describe('and getting test\'s basic info inside a bucket', function () {
    it('it should return the data result', function () {
      return apiMonitor.getBucketTestsLists(token, bucketId)
        .then(testInfoCollection => {
          //console.log(testInfoCollection);
          expect(testInfoCollection.length > 0).to.equal(true);

          expect(testInfoCollection[0] instanceof TestInfo).to.equal(true);
          expect(testInfoCollection[0].id).to.not.be.null;
          expect(testInfoCollection[0].name).to.not.be.null;
          expect(testInfoCollection[0].success).to.not.be.null;
          expect(testInfoCollection[0].results).to.not.be.null;
          expect(testInfoCollection[0].uri).to.not.be.null;
        })
        .catch(error => expect(error).to.be.null);
    });
  });

  describe('and getting tests information', function () {
    it('it should get it ', () => {
      return apiMonitor.getAllTestInformationInBucketByTestIds(token, bucketId, [versionTestId])
        .then((testInfoCollection) => {
          expect(testInfoCollection.length > 0).to.equal(true);
          expect(testInfoCollection[0] instanceof TestInfo).to.equal(true);
          expect(testInfoCollection[0].id).to.not.be.null;
          expect(testInfoCollection[0].name).to.not.be.null;
          expect(testInfoCollection[0].success).to.not.be.null;
          expect(testInfoCollection[0].results).to.not.be.null;
          expect(testInfoCollection[0].uri).to.not.be.null;
        })
        .catch(error => expect(error).to.be.null);
    });
  });

  describe('and getting tests results', function () {
    it('it should get it ', () => {
      return apiMonitor.getAllTestResultsForTestInBucketByTestIds(token, bucketId, [versionTestId])
        .then(testResultsCollectionOfCollections => {
          expect(testResultsCollectionOfCollections).to.not.be.null;

          expect(testResultsCollectionOfCollections.length > 0).to.equal(true);
          expect(testResultsCollectionOfCollections[0] instanceof Array).to.equal(true);
          expect(testResultsCollectionOfCollections[0][0] instanceof TestResult).to.equal(true);
          expect(testResultsCollectionOfCollections[0][0].testId).to.not.be.null;
          expect(testResultsCollectionOfCollections[0][0].runTick).to.not.be.null;
          expect(testResultsCollectionOfCollections[0][0].testResultId).to.not.be.null;
          expect(testResultsCollectionOfCollections[0][0].success).to.not.be.null;
        })
        .catch(error => expect(error).to.be.null);
    });
  });

  describe('and getting tests\' basic info inside a bucket', function () {
    it('when populated', () => {
      return apiMonitor.getLatestTestResultInBucket(token, bucketId, versionTestId)
        .then(actualTestResult => {
          expect(actualTestResult).to.not.be.null;
          expect(actualTestResult instanceof TestResult).to.equal(true);
          expect(actualTestResult.testId).to.equal(versionTestId);
          expect(actualTestResult.runTick).to.not.be.null;
          expect(actualTestResult.testResultId).to.not.be.null;
          expect(actualTestResult.success).to.not.be.null;
        })
        .catch(error => expect(error).to.be.null);
    });
  });

  describe('and getting all test information inside a bucket', function () {
    it('when populated', function () {
      return apiMonitor.getTestInformationInBucket(token, bucketId, versionTestId)
        .then(actualTestInfo => {
          expect(actualTestInfo).to.not.be.null;
          expect(actualTestInfo instanceof TestInfo).to.equal(true);

          expect(actualTestInfo.id).to.equal(versionTestId);
          expect(actualTestInfo.name).to.not.be.null;
          expect(actualTestInfo.success).to.not.be.null;
          expect(actualTestInfo.results).to.not.be.null;
          expect(actualTestInfo.uri).to.not.be.null;
        })
        .catch(error => expect(error).to.be.null);
    });
  });

  describe('and getting all test results inside a bucket', function () {
    this.timeout(15000);
    it('when populated', () => {
      return apiMonitor.getTestResultsForTestInBucket(token, bucketId, versionTestId)
        .then(actualTestResultCollection => {
          expect(actualTestResultCollection).to.not.be.null;
          expect(actualTestResultCollection instanceof Array).to.equal(true);
          expect(actualTestResultCollection[0] instanceof TestResult).to.equal(true);
          expect(actualTestResultCollection[0].testId).to.equal(versionTestId);
          expect(actualTestResultCollection[0].runTick).to.not.be.null;
          expect(actualTestResultCollection[0].testResultId).to.not.be.null;
          expect(actualTestResultCollection[0].success).to.not.be.null;
        })
        .catch(error => expect(error).to.be.null);
    });
  });

  describe('and getting all test results inside a bucket', function () {
    this.timeout(15000);
    it('it should get them', function () {
      return apiMonitor.getMostRecentResultsOfAllTestsInBucket(token, bucketId)
        .then((actualTestInfoCollection) => {
          expect(actualTestInfoCollection.length > 0).to.equal(true);
          expect(actualTestInfoCollection[0] instanceof TestInfo).to.equal(true);
          expect(actualTestInfoCollection[0].id).to.not.be.null;
          expect(actualTestInfoCollection[0].name).to.not.be.null;
          expect(actualTestInfoCollection[0].success).to.not.be.null;
          expect(actualTestInfoCollection[0].results).to.not.be.null;
          expect(actualTestInfoCollection[0].uri).to.not.be.null;
        }).catch(error => expect(error).to.be.null);
    });
  });

  describe('and getting all test results inside a bucket by name', function () {
    this.timeout(15000);
    it('when populated', function () {
      apiMonitor.getMostRecentResultsOfAllTestsInBucketByName(token, bucketName)
        .then(actualTestResultCollection => {
          expect(actualTestResultCollection.bucketInfo.name).to.equal(bucketName);
          expect(actualTestResultCollection.bucketInfo.id).not.be.null;
          expect(actualTestResultCollection.bucketInfo.uri).not.be.null;

          expect(actualTestResultCollection.testData.length > 0).to.equal(true);

          expect(actualTestResultCollection.testData instanceof Array).to.equal(true);
          expect(actualTestResultCollection.testData[0] instanceof TestInfo).to.equal(true);
          expect(actualTestResultCollection.testData[0].id).not.be.null;
          expect(actualTestResultCollection.testData[0].name).not.be.null;
          expect(actualTestResultCollection.testData[0].success).not.be.null;
          expect(actualTestResultCollection.testData[0].results).not.be.null;
          expect(actualTestResultCollection.testData[0].uri).not.be.null;
        })
        .catch(error => expect(error).to.be.null);
    });
  });

  describe('and getting all test results inside a bucket by name', function () {
    this.timeout(15000);
    it('when populated', function () {
      return apiMonitor.getTimeFrameOfTestsInBucketByName(token, bucketName)
        .then(actualTestResultCollection => {
          expect(actualTestResultCollection.bucketInfo.name).to.equal(bucketName);
          expect(actualTestResultCollection.bucketInfo.id).not.be.null;
          expect(actualTestResultCollection.bucketInfo.uri).not.be.null;

          expect(actualTestResultCollection.testData.length > 0).to.equal(true);

          expect(actualTestResultCollection.testData instanceof Array).to.equal(true);
          expect(actualTestResultCollection.testData[0] instanceof TestResultTimeFrame).to.equal(true);
          expect(actualTestResultCollection.testData[0].id).not.be.null;
          expect(actualTestResultCollection.testData[0].name).not.be.null;
          expect(actualTestResultCollection.testData[0].previousTestResult).not.be.null;
          expect(actualTestResultCollection.testData[0].currentTestResult instanceof TestResult).to.equal(true);
          expect(actualTestResultCollection.testData[0].uri).not.be.null;
        })
        .catch((error) => expect(error).to.be.null);
    });
  });

  describe('and getting shared environments', function () {
    it('Should Request buckets Api', () => {
      return apiMonitor.getSharedEnvironments(token, bucketId)
        .then(response => {
          expect(response.length).to.be.greaterThan(0);
          console.log(response);
        })
        .catch(error => expect(error).to.be.null);
    });
  });

  describe('and triggering a test to run', function () {
    it('Should call trigger and get data', () => {
      return apiMonitor.triggerById(token, triggerId, bucketId)
        .then(response => {
          expect(response.length).to.be.greaterThan(0);
          console.log(response);
        })
        .catch(error => expect(error).to.be.null);
    });
  });

  describe('and triggering a test to by triggerUrl', function () {
    it('Should call trigger and get data', () => {
      const testInfo = new TestInfo(null, null, [], null, null, null, triggerUri);
      return apiMonitor.triggerByTestInformation(token, testInfo, bucketId)
        .then(response => {
          expect(response.length).to.be.greaterThan(0);
          console.log(response);
        })
        .catch(error => expect(error).to.be.null);
    });
  });
});
