let wd = require('wd');
let assert = require('assert');
let asserters = wd.asserters;
let Q = wd.Q;
desiredCaps = {
  // Set your BrowserStack access credentials
  'browserstack.user' : 'bayurizkhy_snQWko',
  'browserstack.key' : 'WZ4xpkZvnNREsUkUH8Wt',
    // Set app_url of the application under test
  'app' : 'bs://df7671264546324fac5df2c770de1cfb6a3c1418',
  // Specify device and os_version for testing
  'device' : 'Samsung Galaxy A10',
  'os_version' : '9.0',
  // Set other BrowserStack capabilities
  'project' : 'First NodeJS project',
  'build' : 'browserstack-build-1',
  'name': 'first_test'
};
// Initialize the remote Webdriver using BrowserStack remote URL
// and desired capabilities defined above
driver = wd.promiseRemote("http://hub-cloud.browserstack.com/wd/hub");
// Test case for the BrowserStack sample iOS app. 
// If you have uploaded your app, update the test case here.
driver.init(desiredCaps)
  //Write your custom code here
  .fin(function() { 
    // Invoke driver.quit() after the test is done to indicate that the test is completed.
    return driver.quit(); 
  })
  .done();