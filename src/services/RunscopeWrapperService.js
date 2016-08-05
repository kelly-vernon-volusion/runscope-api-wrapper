const rp = require('request-promise');
const util = require('util');

const getHeaders = (token) => {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
};

class RunscopeWrapperService {
  getMainInfo(token) {
    return rp({
      uri: 'https://api.runscope.com/',
      headers: getHeaders(token),
      resolveWithFullResponse: true
    });
  }

  /**
   * Retrieves a collection of buckets. The object model is:
   * @param {string} token
   * @return {Promise<response>} The response body will resolve in string notation with the following object structure.
   * @example {
   *    "data": [
   *        {
   *            "created_at": 1438828991,
   *            "created_by": {
   *                "email": "grace@example.com",
   *                "name": "Grace Hopper",
   *                "id": "4ee15ecc-7fe1-43cb-aa12-ef50420f2cf9"
   *            },
   *            "default_environment_id": "1eeb3695-5d0f-467c-9d51-8b773dce29ba",
   *            "description": "An internal API!",
   *            "name": "My Service",
   *            "id": "9b47981a-98fd-4dac-8f32-c05aa60b8caf"
   *        }
   *    ],
   *    "error": null,
   *    "meta": {
   *        "status": "success"
   *    }
   * }
   */
  getBuckets(token) {
    return rp({
      uri: 'https://api.runscope.com/buckets',
      headers: getHeaders(token),
      resolveWithFullResponse: true
    });
  }

  /**
   * Gets a collection of shared environments by bucket id
   * @param {string} token
   * @param {string} bucketId
   * @return {Promise<response>} the response body will resolve in string notation with the following object structure.
   * @example {
   *    "emails": {
   *        "notify_all": false,
   *        "notify_on": "all",
   *        "notify_threshold": null,
   *        "recipients": [
   *            {
   *                "email": "grace@example.com",
   *                "name": "Grace Hopper",
   *                "id": "4ee15ecc-7fe1-43cb-aa12-ef50420f2cf9"
   *            }
   *        ]
   *    },
   *    "initial_variables": {
   *        "my_variable": "some value",
   *        "one more": "values"
   *    },
   *    "integrations": [],
   *    "name": "Remote Settings",
   *    "parent_environment_id": null,
   *    "preserve_cookies": false,
   *    "regions": [
   *        "us1",
   *        "jp1"
   *    ],
   *    "remote_agents": [
   *        {
   *            "name": "my-local-machine.runscope.com",
   *            "uuid": "141d4dbc-1e41-401e-8067-6df18501e9ed"
   *        }
   *    ],
   *    "script": "var a = \"asdf\";\nlog(\"OK\");",
   *    "test_id": null,
   *    "id": "f8007150-0052-482c-9d52-c3ea4042e0f5",
   *    "verify_ssl": true,
   *    "client_certificate": "",
   *    "webhooks": [
   *        "http://api.example.com/webhook_reciever",
   *        "https://yourapihere.com/post"
   *    ]
   * }
   */
  getSharedEnvironments(token, bucketId) {
    return rp({
      uri: `https://api.runscope.com/buckets/${bucketId}/environments`,
      headers: getHeaders(token),
      resolveWithFullResponse: true
    });
  }

  /**
   * executes a trigger, which is typically associated by test
   * @param {string} token
   * @param {string} triggerId
   * @param {string} [environmentId] optional, but you can supply your own environment instead of it using the default
   * @return {Promise<response>}
   * @example {
   *    "data": {
   *        "runs": [
   *            {
   *                "agent": null,
   *                "bucket_key": "ujy2zddfsj",
   *                "region": "us1",
   *                "status": "init",
   *                "test_id": "2637778b-26c1-41c6-80ef-a9bb145fe8ff",
   *                "test_name": "Android Integration Tests",
   *                "environment_id": "ab234cdf-26c1-41c6-80ef-a9bb145fe8ff",
   *                "environment_name": "Production",
   *                "test_run_id": "df359b71-56d1-42f3-ab50-5e517a848ac7",
   *                "test_url": "https://www.runscope.com/radar/ujy2zddfsj/2637778b-26c1-41c6-80ef-a9bb145fe8ff",
   *                "test_run_url": "https://www.runscope.com/radar/ujy2zddfsj/2637778b-26c1-41c6-80ef-a9bb145fe8ff/results/df359b71-56d1-42f3-ab50-5e517a848ac7",
   *                "variables": {
   *                    "baseUrl": "https://staging.yourapihere.com",
   *                    "accessToken": "xyzzy",
   *                    "tokenSecret": "shhhhhhhh"
   *                }
   *            }
   *        ],
   *        "runs_failed": 0,
   *        "runs_started": 1,
   *        "runs_total": 1
   *    },
   *    "error": null,
   *    "meta": {
   *        "status": "success"
   *    }
   *}
   */
  triggerById(token, triggerId, environmentId) {
    const baseUri = `https://api.runscope.com/radar/${triggerId}/trigger`;
    const uri = util.isNullOrUndefined(environmentId) ? baseUri : `${baseUri}?runscope_environment=${environmentId}`;

    return rp({
      method: 'POST',
      uri,
      headers: getHeaders(token),
      resolveWithFullResponse: true
    });
  }

  /**
   * executes a trigger, which is typically associated by test
   * @param {string} token
   * @param {string} triggerUri
   * @param {string} [environmentId] optional, but you can supply your own environment instead of it using the default
   * @return {Promise<response>}
   * @example {
   *    "data": {
   *        "runs": [
   *            {
   *                "agent": null,
   *                "bucket_key": "ujy2zddfsj",
   *                "region": "us1",
   *                "status": "init",
   *                "test_id": "2637778b-26c1-41c6-80ef-a9bb145fe8ff",
   *                "test_name": "Android Integration Tests",
   *                "environment_id": "ab234cdf-26c1-41c6-80ef-a9bb145fe8ff",
   *                "environment_name": "Production",
   *                "test_run_id": "df359b71-56d1-42f3-ab50-5e517a848ac7",
   *                "test_url": "https://www.runscope.com/radar/ujy2zddfsj/2637778b-26c1-41c6-80ef-a9bb145fe8ff",
   *                "test_run_url": "https://www.runscope.com/radar/ujy2zddfsj/2637778b-26c1-41c6-80ef-a9bb145fe8ff/results/df359b71-56d1-42f3-ab50-5e517a848ac7",
   *                "variables": {
   *                    "baseUrl": "https://staging.yourapihere.com",
   *                    "accessToken": "xyzzy",
   *                    "tokenSecret": "shhhhhhhh"
   *                }
   *            }
   *        ],
   *        "runs_failed": 0,
   *        "runs_started": 1,
   *        "runs_total": 1
   *    },
   *    "error": null,
   *    "meta": {
   *        "status": "success"
   *    }
   *}
   */
  triggerByUri(token, triggerUri, environmentId) {
    return rp({
      method: 'POST',
      uri: environmentId ? `${triggerUri}?runscope_environment=${environmentId}` : triggerUri,
      headers: getHeaders(token),
      resolveWithFullResponse: true
    });
  }

  /**
   * it defaults the count to 1000.
   * @param {string} token
   * @param {string} bucketId
   * @return {Promise<response>}
   */
  getBucketTestsLists(token, bucketId) {
    return rp({
      uri: `${this.getBucketUri(bucketId)}/tests?count=1000`,
      headers: getHeaders(token),
      resolveWithFullResponse: true
    });
  }

  /**
   * gets the data for a test's data
   * @param {string} token
   * @param {string} bucketId
   * @param {string} testId
   * @return {Promise<response>}
   * @example {
   *    "data": {
   *        "created_at": 1438832081,
   *        "created_by": {
   *            "email": "grace@example.com",
   *            "name": "Grace Hopper",
   *            "id": "4ee15ecc-7fe1-43cb-aa12-ef50420f2cf9"
   *        },
   *        "default_environment_id": "a50b63cc-c377-4823-9a95-8b91f12326f2",
   *        "description": null,
   *        "environments": [
   *            {
   *                "emails": {
   *                    "notify_all": false,
   *                    "notify_on": "all",
   *                    "notify_threshold": 1,
   *                    "recipients": []
   *                },
   *                "initial_variables": {
   *                    "base_url": "https://api.example.com"
   *                },
   *                "integrations": [
   *                    {
   *                        "description": "Pagerduty Account",
   *                        "integration_type": "pagerduty",
   *                        "id": "53776d9a-4f34-4f1f-9gff-c155dfb6692e"
   *                    }
   *                ],
   *                "name": "Test Settings",
   *                "parent_environment_id": null,
   *                "preserve_cookies": false,
   *                "regions": [
   *                    "us1"
   *                ],
   *                "remote_agents": [],
   *                "script": "",
   *                "test_id": "626a024c-f75e-4f57-82d4-104fe443c0f3",
   *                "id": "a50b63cc-c377-4823-9a95-8b91f12326f2",
   *                "verify_ssl": true,
   *                "webhooks": null
   *            }
   *        ],
   *        "last_run": null,
   *        "name": "Sample Name",
   *        "schedules": [],
   *        "steps": [
   *            {
   *                "assertions": [
   *                    {
   *                        "comparison": "is_equal",
   *                        "source": "response_status",
   *                        "value": 200
   *                    }
   *                ],
   *                "auth": {},
   *                "body": "",
   *                "form": {},
   *                "headers": {},
   *                "method": "GET",
   *                "note": "",
   *                "step_type": "request",
   *                "url": "https://yourapihere.com/",
   *                "id": "53f8e1fd-0989-491a-9f15-cc055f27d097",
   *                "variables": []
   *            }
   *        ],
   *        "trigger_url": "http://api.runscope.com/radar/b96ecee2-cce6-4d80-8f07-33ac22a22ebd/trigger",
   *        "id": "626a024c-f75e-4f57-82d4-104fe443c0f3"
   *    },
   *    "error": null,
   *    "meta": {
   *        "status": "success"
   *    }
   *}
   */
  getTestInformationInBucket(token, bucketId, testId) {
    return rp({
      uri: this.getTestInformationInBucketUri(bucketId, testId),
      headers: getHeaders(token),
      resolveWithFullResponse: true
    });
  }

  /**
   * The location of your bucket within their api.
   * @param {string} bucketId
   * @return {string} the uri
   */
  getBucketUri(bucketId) {
    return `https://api.runscope.com/buckets/${bucketId}`;
  }

  /**
   * Provides the location of where your bucket is on the internets!
   * @param {string} bucketId
   * @return {string} the uri
   */
  getBucketPageUri(bucketId) {
    return `https://www.runscope.com/radar/${bucketId}`;
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
      headers: getHeaders(token),
      resolveWithFullResponse: true
    });
  }

  /**
   *
   * @param {string} token
   * @param {string} bucketId
   * @param {string} testId
   * @param {string} testResultId
   * @return {Promise<response>}
   */
  getTestResultByResultId(token, bucketId, testId, testResultId) {
    return rp({
      uri: this.getTestResultByIdInBucketUri(bucketId, testId, testResultId),
      headers: getHeaders(token),
      resolveWithFullResponse: true
    });
  }

  /**
   *
   * @param {string} token
   * @param {string} bucketId
   * @param {string} testId
   * @returns {Promise<response>}
   */
  getLatestTestResultsInBucket(token, bucketId, testId) {
    return rp({
      uri: this.getTestResultByIdInBucketUri(bucketId, testId, 'latest'),
      headers: getHeaders(token),
      resolveWithFullResponse: true
    });
  }
}

module.exports = RunscopeWrapperService;
