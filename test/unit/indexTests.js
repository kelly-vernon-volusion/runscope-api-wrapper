let expect = require('chai').expect;

describe('When testing index', ()=> {
    it('should have ApiMonitorService', ()=> {
      const ApiMonitorService = require('./../../src/index.js').ApiMonitorService;
      const entity = new ApiMonitorService();

      expect(entity).to.be.instanceof(ApiMonitorService);
    });

    it('should have RunscopeWrapperService', ()=> {
      const RunscopeWrapperService = require('./../../src/index.js').RunscopeWrapperService;
      const entity = new RunscopeWrapperService();

      expect(entity).to.be.instanceof(RunscopeWrapperService);
    });

    it('should have BucketInfo', ()=> {
      const BucketInfo = require('./../../src/index.js').BucketInfo;
      const entity = new BucketInfo();

      expect(entity).to.be.instanceof(BucketInfo);
    });

    it('should have TestInfo', ()=> {
      const TestInfo = require('./../../src/index.js').TestInfo;
      const entity = new TestInfo();

      expect(entity).to.be.instanceof(TestInfo);
    });

    it('should have TestResult', ()=> {
      const TestResult = require('./../../src/index.js').TestResult;
      const entity = new TestResult();

      expect(entity).to.be.instanceof(TestResult);
    });

    it('should have TestResultCollection', ()=> {
      const TestResultCollection = require('./../../src/index.js').TestResultCollection;
      const entity = new TestResultCollection();

      expect(entity).to.be.instanceof(TestResultCollection);
    });

    it('should have TestResultTimeFrame', ()=> {
      const TestResultTimeFrame = require('./../../src/index.js').TestResultTimeFrame;
      const entity = new TestResultTimeFrame();

      expect(entity).to.be.instanceof(TestResultTimeFrame);
    });
});
