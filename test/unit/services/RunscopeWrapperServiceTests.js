const expect = require('chai').expect;
const uuid = require('uuidv4');
const mockery = require('mockery');
const sinon = require('sinon');
require('sinon-as-promised');

const moduleName = '../../../src/services/RunscopeWrapperService.js';

describe('RunscopeWrapperService unit tests', () => {
  let sandbox;
  let RunscopeWrapperService;
  let token;
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

  describe('When signed in', () => {
    let service = null;

    afterEach(() => {
      service = null;
    });

    describe('and calling main api', () => {
      it('Should form valid request', () => {
        const mock = sandbox.stub().resolves();
        mockery.registerMock('request-promise', mock);

        RunscopeWrapperService = require(moduleName);
        service = new RunscopeWrapperService();

        return service.getMainInfo(token).then(() =>
          expect(mock.calledWith({
            uri: 'https://api.runscope.com/',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            resolveWithFullResponse: true
          })).to.equal(true)
        );
      });
    });

    describe('and calling buckets', () => {
      it('Should form valid request', () => {
        const mock = sandbox.stub().resolves();
        mockery.registerMock('request-promise', mock);

        RunscopeWrapperService = require(moduleName);
        service = new RunscopeWrapperService();

        return service.getBuckets(token).then(() =>
          expect(mock.calledWith({
            uri: 'https://api.runscope.com/buckets',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            resolveWithFullResponse: true
          })).to.equal(true)
        );
      });
    });

    describe('and calling test results', () => {
      it('Should form valid request', () => {
        const testId = uuid();
        const mock = sandbox.stub().resolves();
        const uri = `/buckets/${bucketId}/tests/${testId}`;

        mockery.registerMock('request-promise', mock);

        RunscopeWrapperService = require(moduleName);
        service = new RunscopeWrapperService();

        return service.getTestInformationInBucket(token, bucketId, testId).then(() =>
          expect(mock.calledWith({
            uri: `https://api.runscope.com${uri}`,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            resolveWithFullResponse: true
          })).to.equal(true)
        );
      });
    });

    describe('and calling latest test results', () => {
      it('Should form valid request', () => {
        const testId = uuid();
        const mock = sandbox.stub().resolves();
        const uri = `/buckets/${bucketId}/tests/${testId}/results/latest`;

        mockery.registerMock('request-promise', mock);

        RunscopeWrapperService = require(moduleName);
        service = new RunscopeWrapperService();

        return service.getLatestTestResultsInBucket(token, bucketId, testId).then(() =>
          expect(mock.calledWith({
            uri: `https://api.runscope.com${uri}`,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            resolveWithFullResponse: true
          })).to.equal(true)
        );
      });
    });

    describe('and calling test result for a test', () => {
      it('Should form valid request', () => {
        const testId = uuid();
        const testResultId = uuid();
        const mock = sandbox.stub().resolves();
        const uri = `/buckets/${bucketId}/tests/${testId}/results/${testResultId}`;

        mockery.registerMock('request-promise', mock);

        RunscopeWrapperService = require(moduleName);
        service = new RunscopeWrapperService();

        return service.getTestResultByResultId(token, bucketId, testId, testResultId).then(() =>
          expect(mock.calledWith({
            uri: `https://api.runscope.com${uri}`,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            resolveWithFullResponse: true
          })).to.equal(true)
        );
      });
    });

    describe('and getting tests in a bucket', () => {
      it('Should form valid request', () => {
        const mock = sandbox.stub().resolves();
        const uri = `/buckets/${bucketId}/tests?count=1000`;

        mockery.registerMock('request-promise', mock);

        RunscopeWrapperService = require(moduleName);
        service = new RunscopeWrapperService();

        return service.getBucketTestsLists(token, bucketId).then(() =>
          expect(mock.calledWith({
            uri: `https://api.runscope.com${uri}`,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            resolveWithFullResponse: true
          })).to.equal(true)
        );
      });
    });

    describe('and getting tests results for test in a bucket', () => {
      it('Should form valid request', () => {
        const test = uuid();
        const mock = sandbox.stub().resolves();
        const uri = `/buckets/${bucketId}/tests/${test}/results`;

        mockery.registerMock('request-promise', mock);

        RunscopeWrapperService = require(moduleName);
        service = new RunscopeWrapperService();

        return service.getTestResultsForTestInBucket(token, bucketId, test).then(() =>
          expect(mock.calledWith({
            uri: `https://api.runscope.com${uri}`,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            resolveWithFullResponse: true
          })).to.equal(true)
        );
      });
    });
  });
});
