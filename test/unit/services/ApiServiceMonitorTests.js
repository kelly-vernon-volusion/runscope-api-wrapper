let chai = require('chai');
let expect = require('chai').expect;
let uuid = require('uuidv4');
let mockery = require('mockery');
const sinon = require('sinon');
require('sinon-as-promised');

let TestResultCollection = require("../../../src/models/TestResultCollection.js");
let TestResultTimeFrame = require("../../../src/models/TestResultTimeFrame.js");
let SuccessTypes = require("../../../src/models/SuccessTypes.js");
let BucketInfo = require("../../../src/models/BucketInfo.js");
let TestInfo = require("../../../src/models/TestInfo.js");
let TestResult = require("../../../src/models/TestResult.js");

describe("ApiServiceMonitor", () => {
  let sandbox;
  let RunscopeWrapperService;
  let token;
  let RunscopeWrapperServiceLocation = './RunscopeWrapperService';
  var ApiModuleServiceLocation = "../../../src/services/ApiMonitorService.js";
  let bucketId;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();

    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    sandbox = sinon.sandbox.create();

    token = uuid();
    bucketId = uuid();
  });

  afterEach(() => {
    sandbox.restore();
    mockery.disable();
    mockery.deregisterAll();
    token = null;
    bucketId = null;
  });

  describe("and getting buckets", function () {
    it("when populated", () => {
      let bucketInfo = {name: uuid(), key: uuid()};
      let uri = '';
      let runscopeServiceMock = function RunscopeWrapperService() {
        return {
          getBuckets: sandbox.stub().resolves({
            body: JSON.stringify({data: [bucketInfo]})
          }),
          getBucketPageUri: () => uri
        };
      };

      mockery.registerMock(RunscopeWrapperServiceLocation, runscopeServiceMock);

      let ApiMonitorService = require(ApiModuleServiceLocation);
      let apiMonitor = new ApiMonitorService();

      return apiMonitor.getBuckets(token)
        .then(data => {
          expect(data.length).to.be.greaterThan(0);
          expect(data[0].isNew()).to.equal(false);
          expect(data[0].name).to.equal(bucketInfo.name);
          expect(data[0].id).to.equal(bucketInfo.key);
          expect(data[0].uri).to.equal(uri);
        })
    });
  });

  describe("and getting tests' basic info inside a bucket", () => {
    it("it should return the data result", function () {
      let runscopeServiceMock = function RunscopeWrapperService() {
        return {
          getBucketTestsLists: sandbox.stub().resolves({
            body: JSON.stringify({
              data: [{
                name: uuid(),
                id: uuid(),
                schedules: []
              }]
            })
          }),
          getTestResultsInBucketPageUri: sandbox.stub().returns()
        };
      };

      mockery.registerMock(RunscopeWrapperServiceLocation, runscopeServiceMock);

      let ApiMonitorService = require(ApiModuleServiceLocation);
      let apiMonitor = new ApiMonitorService();

      return apiMonitor.getBucketTestsLists(token, bucketId)
        .then(testInfoCollection => {

          expect(testInfoCollection.length > 0).to.equal(true);

          expect(testInfoCollection[0].id).to.not.be.null;
          expect(testInfoCollection[0].name).to.not.be.null;
          expect(testInfoCollection[0].success).to.not.be.null;
          expect(testInfoCollection[0].results).to.not.be.null;
          expect(testInfoCollection[0].uri).to.not.be.null;
        });
    });
  });

  describe("and getting tests information", function () {
    this.timeout(4000);

    it("it should get it ", () => {
      let testInfo = {
        id: uuid(),
        schedules: []
      };

      let runscopeServiceMock = function RunscopeWrapperService() {
        return {
          getTestInformationInBucket: sandbox.stub().resolves({
            body: JSON.stringify({data: [testInfo]})
          }),
          getTestResultsInBucketPageUri: sandbox.stub().returns('')
        };
      };

      mockery.registerMock(RunscopeWrapperServiceLocation, runscopeServiceMock);

      let versionTestId = uuid();

      let ApiMonitorService = require(ApiModuleServiceLocation);
      let apiMonitor = new ApiMonitorService();

      return apiMonitor.getAllTestInformationInBucketByTestIds(token, bucketId, [versionTestId])
        .then(testInfoCollection => {
          //console.log(testInfoCollection);

          expect(testInfoCollection.length > 0).to.equal(true);
          expect(testInfoCollection[0].id).to.equal(testInfo.key);
          expect(testInfoCollection[0].success).to.equal('not run');
          expect(testInfoCollection[0].results).to.deep.equal([]);
          expect(testInfoCollection[0].uri).to.equal('')
        });
    });
  });

  describe("and getting tests results", function () {
    it("it should get it ", () => {
      let testResult = {
        test_id: uuid(),
        started_at: uuid(),
        result: uuid(),
        test_run_id: uuid()
      };

      let runscopeServiceMock = function RunscopeWrapperService() {
        return {
          getTestResultsForTestInBucket: sandbox.stub().resolves({
            body: JSON.stringify({data: [testResult]})
          }),
          getBucketPageUri: sandbox.stub().returns('')
        };
      };

      mockery.registerMock(RunscopeWrapperServiceLocation, runscopeServiceMock);

      let ApiMonitorService = require(ApiModuleServiceLocation);
      let apiMonitor = new ApiMonitorService();

      let versionTestId = uuid();

      return apiMonitor.getAllTestResultsForTestInBucketByTestIds(token, bucketId, [versionTestId])
        .then((testResultsCollectionOfCollections) => {
          //console.log(testResultsCollectionOfCollections);
          expect(testResultsCollectionOfCollections).to.not.be.null;

          expect(testResultsCollectionOfCollections.length > 0).to.equal(true);
          expect(testResultsCollectionOfCollections[0] instanceof Array).to.equal(true);
          expect(testResultsCollectionOfCollections[0][0].testId).to.equal(testResult.test_id);
          expect(testResultsCollectionOfCollections[0][0].runTick).to.equal(testResult.started_at);
          expect(testResultsCollectionOfCollections[0][0].testResultId).to.equal(testResult.test_run_id);
          expect(testResultsCollectionOfCollections[0][0].success).to.equal(testResult.result);
        });
    });
  });

  describe("and getting tests' basic info inside a bucket", function () {
    it("when populated", () => {
      let dataItem = {
        test_id: uuid(),
        started_at: uuid(),
        result: uuid(),
        test_run_id: uuid()
      };

      let runscopeServiceMock = function RunscopeWrapperService() {
        return {
          getLatestTestResultsInBucket: sandbox.stub().resolves({
            body: JSON.stringify({data: dataItem})
          }),
          getBucketPageUri: sandbox.stub().returns('')
        };
      };

      mockery.registerMock(RunscopeWrapperServiceLocation, runscopeServiceMock);

      let ApiMonitorService = require(ApiModuleServiceLocation);
      let apiMonitor = new ApiMonitorService();

      let versionTestId = uuid();

      return apiMonitor.getLatestTestResultInBucket(token, bucketId, versionTestId)
        .then(actualTestResult => {
          expect(actualTestResult).to.not.be.null;
          expect(actualTestResult.testId).to.equal(versionTestId);
          expect(actualTestResult.runTick).to.equal(-1);
          expect(actualTestResult.testResultId).to.equal(-1);
          expect(actualTestResult.success).to.equal(dataItem.result);
        });
    });
  });

  describe("and getting all test information inside a bucket", () => {
    it("when populated", function () {
      let versionTestId = uuid();

      let info = {
        name:uuid(),
        id: versionTestId,
        schedules: []
      };

      let runscopeServiceMock = function RunscopeWrapperService() {
        return {
          getTestInformationInBucket: sandbox.stub().resolves({
            body: JSON.stringify({data: info})
          }),
          getTestResultsInBucketPageUri: sandbox.stub().returns('')
        };
      };

      mockery.registerMock(RunscopeWrapperServiceLocation, runscopeServiceMock);

      let ApiMonitorService = require(ApiModuleServiceLocation);
      let apiMonitor = new ApiMonitorService();

      return apiMonitor.getTestInformationInBucket(token, bucketId, versionTestId)
        .then(actualTestInfo => {
          console.log(actualTestInfo);

          expect(actualTestInfo.success).to.equal('not run');
          expect(actualTestInfo.results).to.deep.equal([]);
          expect(actualTestInfo.uri).to.equal('');
          expect(actualTestInfo.id).to.equal(versionTestId);
          expect(actualTestInfo.name).to.equal(info.name);
        });
    });
  });

  describe("and getting all test results inside a bucket", function () {
    it("when populated", () => {
      let versionTestId = uuid();
      let dataItem = {
        test_id: versionTestId,
        started_at: uuid()
      };

      let runscopeServiceMock = function RunscopeWrapperService() {
        return {
          getTestResultsForTestInBucket: sandbox.stub().resolves({
            body: JSON.stringify({data: [dataItem]})
          }),
          getBucketPageUri: sandbox.stub().returns('')
        };
      };
      let ser = mockery.registerMock(RunscopeWrapperServiceLocation, runscopeServiceMock);

      let ApiMonitorService = require(ApiModuleServiceLocation);
      let apiMonitor = new ApiMonitorService();
      return apiMonitor.getTestResultsForTestInBucket(token, bucketId, versionTestId)
        .then(function (actualTestResultCollection) {
          console.log(actualTestResultCollection);

          expect(actualTestResultCollection).to.not.be.null;
          expect(actualTestResultCollection instanceof Array).to.equal(true);
          expect(actualTestResultCollection[0].testId).to.equal(versionTestId);
          expect(actualTestResultCollection[0].runTick).to.equal(dataItem.started_at);
          expect(actualTestResultCollection[0].testResultId).to.equal(dataItem.result);
          expect(actualTestResultCollection[0].success).to.equal(dataItem.result);
        });
    });
  });

  describe("and getting all test results inside a bucket", () => {
    it("it should get them", function () {
      let versionTestId = uuid();

      let info = {
        name:uuid(),
        id: versionTestId,
        schedules: []
      };

      let runscopeServiceMock = function RunscopeWrapperService() {
        return {
          getTestResultsInBucketPageUri: sandbox.stub().returns(''),
          getBucketTestsLists: sandbox.stub().resolves({
            body: JSON.stringify({
              data: [{
                name: uuid(),
                id: uuid(),
                schedules: []
              }]
            })
          }),
          getTestInformationInBucket: sandbox.stub().resolves({
            body: JSON.stringify({data: info})
          }),
          getTestResultsForTestInBucket: sandbox.stub().resolves({
            body: JSON.stringify({data: [info]})
          })
        };
      };

      mockery.registerMock(RunscopeWrapperServiceLocation, runscopeServiceMock);

      let ApiMonitorService = require(ApiModuleServiceLocation);
      let apiMonitor = new ApiMonitorService();
      return apiMonitor.getMostRecentResultsOfAllTestsInBucket(token, bucketId)
        .then(actualTestInfoCollection => {
          expect(actualTestInfoCollection.length > 0).to.equal(true);
          expect(actualTestInfoCollection[0].id).to.not.be.null;
          expect(actualTestInfoCollection[0].name).to.not.be.null;
          expect(actualTestInfoCollection[0].success).to.not.be.null;
          expect(actualTestInfoCollection[0].results).to.not.be.null;
          expect(actualTestInfoCollection[0].uri).to.not.be.null;
        });
    });
  });

  describe("and getting all test results inside a bucket by name", () => {
    it("when populated", function () {
      let bucketItem = {
        name: `bucket name ${uuid()}`,
        key: `key${uuid()}`
      };

      let info = {
        name: `test name ${uuid()}`,
        id: bucketItem.key,
        schedules: []
      };

      let testList = {
        name: info.name,
        id: info.id,
        schedules: []
      };

      let recentTestResults = {
        id: uuid(),
        test_id: info.id
      };

      let runscopeServiceMock = function RunscopeWrapperService() {
        return {
          getTestResultsInBucketPageUri: sandbox.stub().returns(''),
          getBuckets: sandbox.stub().resolves({
            body: JSON.stringify({data: [bucketItem]})
          }),
          getBucketTestsLists: sandbox.stub().resolves({
            body: JSON.stringify({
              data: [testList]
            })
          }),
          getTestInformationInBucket: sandbox.stub().resolves({
            body: JSON.stringify({data: info})
          }),
          getBucketPageUri: sandbox.stub().returns(''),
          getMostRecentResultsOfAllTestsInBucket: sandbox.stub().resolves({
            body: JSON.stringify({data: [recentTestResults]})
          }),
          getTestResultsForTestInBucket: sandbox.stub().resolves({
            body: JSON.stringify({data: [info]})
          })
        };
      };

      mockery.registerMock(RunscopeWrapperServiceLocation, runscopeServiceMock);

      let ApiMonitorService = require(ApiModuleServiceLocation);
      let apiMonitor = new ApiMonitorService();

      return apiMonitor.getMostRecentResultsOfAllTestsInBucketByName(token, bucketItem.name)
        .then(actualTestResultCollection => {
          expect(actualTestResultCollection.bucketInfo.name).to.equal(bucketItem.name);
          expect(actualTestResultCollection.bucketInfo.id).to.equal(bucketItem.key);
          expect(actualTestResultCollection.bucketInfo.uri).to.equal('');

          expect(actualTestResultCollection.testData.length > 0).to.equal(true);

          expect(actualTestResultCollection.testData[0].id).to.equal(bucketItem.key);
          expect(actualTestResultCollection.testData[0].name).to.equal(info.name);
          expect(actualTestResultCollection.testData[0].success).to.equal('not run');
          expect(actualTestResultCollection.testData[0].results).to.deep.equal([]);
          expect(actualTestResultCollection.testData[0].uri).to.equal('');
        });
    });
  });

  describe("and getting all test results inside a bucket by name", () => {
    it("when populated", function () {
      let bucketItem = {
        name: `bucket name ${uuid()}`,
        key: `key${uuid()}`
      };

      let info = {
        name: `test name ${uuid()}`,
        id: bucketItem.key,
        schedules: []
      };

      let testList = {
        name: info.name,
        id: info.id,
        schedules: []
      };

      let recentTestResults = {
        id: uuid(),
        test_id: info.id
      };

      let runscopeServiceMock = function RunscopeWrapperService() {
        return {
          getTestResultsInBucketPageUri: sandbox.stub().returns(''),
          getBuckets: sandbox.stub().resolves({
            body: JSON.stringify({data: [bucketItem]})
          }),
          getBucketTestsLists: sandbox.stub().resolves({
            body: JSON.stringify({
              data: [testList]
            })
          }),
          getTestInformationInBucket: sandbox.stub().resolves({
            body: JSON.stringify({data: info})
          }),
          getBucketPageUri: sandbox.stub().returns(''),
          getMostRecentResultsOfAllTestsInBucket: sandbox.stub().resolves({
            body: JSON.stringify({data: [recentTestResults]})
          }),
          getTestResultsForTestInBucket: sandbox.stub().resolves({
            body: JSON.stringify({data: [info]})
          })
        };
      };

      mockery.registerMock(RunscopeWrapperServiceLocation, runscopeServiceMock);

      let ApiMonitorService = require(ApiModuleServiceLocation);
      let apiMonitor = new ApiMonitorService();

      return apiMonitor.getTimeFrameOfTestsInBucketByName(token, bucketItem.name)
        .then(actualTestResultCollection => {
          expect(actualTestResultCollection.bucketInfo.name).to.equal(bucketItem.name);
          expect(actualTestResultCollection.bucketInfo.id).to.equal(bucketItem.key);
          expect(actualTestResultCollection.bucketInfo.uri).to.equal('');

          expect(actualTestResultCollection.testData.length > 0).to.equal(true);

          expect(actualTestResultCollection.testData instanceof Array).to.equal(true);
          expect(actualTestResultCollection.testData[0].id).to.equal(bucketItem.key);
          expect(actualTestResultCollection.testData[0].name).to.equal(info.name);

          console.log(actualTestResultCollection.testData[0].previousTestResult);
          expect(actualTestResultCollection.testData[0].previousTestResult).to.deep.equal({testId: -1, runTick: -1,testResultId: -1, success : 'not run'});

          expect(actualTestResultCollection.testData[0].uri).to.equal('');
        })
    });
  });
});
