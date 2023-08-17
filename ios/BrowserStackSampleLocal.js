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
    "forceW3C": true,

    // Specify device and os_version for testing
    "platformName": "ios",
    "appium:platformVersion": "12",
    "appium:deviceName": 'iPhone XS',

    // Set URL of the application under test
    "appium:app": 'bs://<app-id>',
    // Set other BrowserStack capabilities
    'bstack:options' : {
      "projectName" : "First NodeJS iOS Project",
      "buildName" : "browserstack-build-1",
      "sessionName" : "BStack local_test",
      "debug" : "true",
      "local" : "true",
      "userName" : userName,
      "accessKey" : accessKey
    }
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
  driver = wd.promiseRemote("http://hub.browserstack.com/wd/hub");

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

