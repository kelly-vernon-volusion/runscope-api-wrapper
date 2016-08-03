const expect = require('chai').expect;

const RunscopeWrapperService = require('../../../src/services/RunscopeWrapperService.js');

const testId = process.env.testId;
const token = process.env.token;
const bucketId = process.env.bucketId;

describe('RunscopeWrapperService integration tests', function () {
  this.timeout(5000);

  describe('When signed in', function () {
    let service = null;

    beforeEach(() => {
      service = new RunscopeWrapperService();
    });

    afterEach(() => {
      service = null;
    });

    describe('and calling main api', function () {
      it('Should Request Api', () => {
        return service.getMainInfo(token)
          .then(response => expect(typeof response.body).to.equal('string'))
          .catch(error => expect(error).to.be.null);
      });
    });

    describe('and calling buckets', function () {
      it('Should Request buckets Api', () => {
        return service.getBuckets(token)
          .then(response => {
            expect(typeof response.body).to.equal('string');
            const result = JSON.parse(response.body);
            expect(result.data.length).to.be.greaterThan(0);
            console.log(result.data);
          })
          .catch(error => expect(error).to.be.null);
      });
    });

    describe('and calling test results', function () {
      it('Should get test results', () => {
        return service.getTestInformationInBucket(token, bucketId, testId)
          .then(response => {
            expect(typeof response.body).to.equal('string');
            const result = JSON.parse(response.body);

            expect(result.data.schedules).to.not.be.null;
            expect(result.data.schedules.length).to.be.greaterThan(-1);
          })
          .catch(error => expect(error).to.be.null);
      });
    });

    describe('and calling latest test results', function () {
      it('Should get latest results in bucket by request', () => {
        return service.getLatestTestResultsInBucket(token, bucketId, testId)
          .then(response => {
            expect(typeof response.body).to.equal('string');
            const result = JSON.parse(response.body);

            expect(result.data.result).to.not.be.null;
          }).catch(error => {
            console.log(error);
            expect(error).to.be.null;
          });
      });
    });

    describe('and getting tests in a bucket', function () {
      it('Should Request buckets Api', () => {
        this.timeout(5000);
        return service.getBucketTestsLists(token, bucketId)
          .then(response => {
            const testsListData = JSON.parse(response.body);
            expect(testsListData.data.length).to.be.greaterThan(0);
          })
          .catch(error => expect(error).to.be.null);
      });
    });
  });
});
