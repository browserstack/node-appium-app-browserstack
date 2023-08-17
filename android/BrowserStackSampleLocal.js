let wd = require('wd');
let assert = require('assert');
let asserters = wd.asserters;
let Q = wd.Q;
let browserstack = require('browserstack-local');

// Set your BrowserStack access credentials
let userName = "YOUR_USERNAME"
let accessKey = "YOUR_ACCESS_KEY"

desiredCaps = {
    "forceW3C": true,

    // Specify device and os_version for testing
    "platformName": "Android",
    "appium:platformVersion": "9.0",
    "appium:deviceName": 'Google Pixel 3',

    // Set URL of the application under test
    "appium:app": 'bs://<app-id>',
    // Set other BrowserStack capabilities
    'bstack:options' : {
      "projectName" : "First NodeJS Android Project",
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

    // Test case for the BrowserStack sample Android Local app. 
    // If you have uploaded your app, update the test case here. 
    driver.init(desiredCaps)
    .then(function () {
      return driver.waitForElementById('com.example.android.basicnetworking:id/test_action', asserters.isDisplayed && asserters.isEnabled, 30000);
    })
    .then(function (testElement) {
      return testElement.click();
    })
    .then(function () {
      return driver.waitForElementsByClassName('android.widget.TextView', asserters.isDisplayed, 30000);
    })
    .then(function (textElements) {
      return Q().then(function () {
        return textElements.map(function (textElement) {
          return textElement.text().then(function(value) {
            if (value.indexOf('The active connection is') !== -1) {
              console.log(value);
              assert(value.indexOf('The active connection is wifi') !== -1);
              assert(value.indexOf('Up and running') !== -1);
            }
          });
        })
      }).all()
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
}, function(error) { 
    console.log("Failed to start BrowserStack Local :" + error)
})