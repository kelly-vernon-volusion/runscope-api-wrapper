# runscope-api-wrapper

Currently this is a wrapper based on their api, not sdk for runscope. 

The goal is to provide a way to look up all your tests within a bucket and determine the status of the last two results. There are lots of methods to help but the most advantagous one is doing the following:

Example 1: by using the bucket id supplied it returns the results of all tests that have a schedule.

    const apiMonitor = new ApiMonitorService();
    return apiMonitor.getMostRecentResultsOfAllTestsInBucket(token, bucketId)
      .then(results => {
        // do something with the results array
      });
      
Example 2: Grabs the first bucket that matches by the bucket name supplied, then it calls the method from Example 1.

    const apiMonitor = new ApiMonitorService();
    return apiMonitor.getTimeFrameOfTestsInBucketByName(token, bucketName)
      .then(results => {
         // do something with the results array
      });
      
For more examples please check out the tests withing the source code over at https://github.com/MaterialDev/runscope-api-wrapper.
