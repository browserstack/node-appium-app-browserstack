let wd = require('wd');
let assert = require('assert');
let asserters = wd.asserters;
let Asserter = wd.Asserter;
let browserstack = require('browserstack-local');
let chai = require("chai");
let chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
chai.should();
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

// Set your BrowserStack access credentials
let userName = 'YOUR_USERNAME'
let accessKey = "YOUR_ACCESS_KEY"

desiredCaps = {
     'browserstack.user' : userName,
     'browserstack.key' : accessKey,
  
     // Set URL of the application under test
     'app' : 'bs://<app-id>',
  
    // Specify device and os_version for testingg
    'device' : 'iPhone 11 Pro',
    'os_version' : '13',
  
    //Set browserstack.local capability as true
    'browserstack.local' : true,
  
    // Set other BrowserStack capabilities
    'project' : 'First NodeJS project',
    'build' : 'Node iOS Local',
    'name': 'local_test',
    'browserstack.debug' : true,
};

let promise = new Promise(function(resolve, reject) {
  // Start BrowserStack Local
  exports.bs_local = new browserstack.Local();
  exports.bs_local.start({'key':  accessKey}, (error) => {
    if (error) return reject(error);
    console.log('BrowserStack Local connected.');
    resolve();
  });
});

promise.then(function() {
  // Initialize the remote Webdriver using BrowserStack remote URL
  // and desired capabilities defined above
  driver = wd.promiseRemote("http://hub-cloud.browserstack.com/wd/hub");

  // Test case for the BrowserStack sample iOS Local app. 
  // If you have uploaded your app, update the test case here. 
  driver.init(desiredCaps)
  .then(function () {
    return driver.waitForElementById('TestBrowserStackLocal', asserters.isDisplayed && asserters.isEnabled, 30000);
  })
  .then(function (testElement) {
    return testElement.click();
  })
  .then(function () {
    return driver.waitForElementById('ResultBrowserStackLocal', asserters.isDisplayed, 30000);
  })
  .then(function (resultElement) {
    return resultElement.text().should.eventually.include('Up and running');
  })
  .fin(function() { 
     // Invoke driver.quit() after the test is done to indicate that the test is completed.
    return driver.quit(); 
  })
  .done(function() {
    // Stop BrowserStack Local
    exports.bs_local.stop((error) => {
      if(error) return console.log("Error in stopping BrowserStack Local :"+ error)
      console.log("Stopped BrowserStack Local")
    })
  });

},function(error) {
  console.log("Failed to start BrowserStack Local :" + error)
})

