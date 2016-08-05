# runscope-api-wrapper

Currently this is a wrapper based on their api, not sdk for runscope. 

## Getting Test Results in a bucket

The goal is to provide a way to look up all your tests within a bucket and determine the status of the last two results. There are lots of methods to help but the most advantagous one is doing the following:

Example 1: by using the bucket id supplied it returns the results of all tests that have a schedule.

    const apiMonitor = new ApiMonitorService();
    apiMonitor.getMostRecentResultsOfAllTestsInBucket(token, bucketId)
      .then(results => {
        // do something with the results array
      });
      
Example 2: Grabs the first bucket that matches by the bucket name supplied, then it calls the method from Example 1.

    const apiMonitor = new ApiMonitorService();
    apiMonitor.getTimeFrameOfTestsInBucketByName(token, bucketName)
      .then(results => {
         // do something with the results array
      });
      
## Triggers

You can now do triggers! The basic flow is as follows:

1. Get your tests in the bucket via ApiMonitorService
2. From the collection supply the TestInfo to ApiMonitorService's trigger method of your choice:

       const apiMonitor = new ApiMonitorService();
       apiMonitor.getBuckets(token).then(bucketCollection => {
         // I have buckets!
         apiMonitor.getBucketTestsLists(token, bucketCollection[0].id).then(testInformationCollection => {
           //Now we have tests too!
           //env can also be grabbed too! In this case we make it null and tell it to use the default environment
           const env = null
           apiMonitor.triggerByTestInformation(token, testInformationCollection[0], env).then(runCollection => {
             // do something with the results array
           });          
         });
       });
       
For more examples please check out the tests withing the source code over at https://github.com/MaterialDev/runscope-api-wrapper.
