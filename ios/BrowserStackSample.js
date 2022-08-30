let wd = require('wd');
let assert = require('assert');
let asserters = wd.asserters;
let Q = wd.Q;

desiredCaps = {
    "forceW3C": true,

    // Specify device and os_version for testing
    "platformName": "ios",
    "appium:platformVersion": "13",
    "appium:deviceName": 'iPhone 11 Pro',

    // Set URL of the application under test
    "appium:app": 'bs://<app-id>',
    // Set other BrowserStack capabilities
    'bstack:options' : {
      "projectName" : "First NodeJS iOS Project",
      "buildName" : "browserstack-build-1",
      "sessionName" : "BStack first_test",
      "debug" : "true",
      "userName" : "YOUR_USERNAME",
      "accessKey" : "YOUR_ACCESS_KEY"
    }
};

// Initialize the remote Webdriver using BrowserStack remote URL
// and desired capabilities defined above
driver = wd.promiseRemote("http://hub.browserstack.com/wd/hub");

// Test case for the BrowserStack sample iOS app. 
// If you have uploaded your app, update the test case here.
driver.init(desiredCaps)
  .then(function () {
    return driver.waitForElementById('Text Button', asserters.isDisplayed 
    && asserters.isEnabled, 30000);
  })
  .then(function (textButton) {
    return textButton.click();
  })
  .then(function () {
    return driver.waitForElementById('Text Input', asserters.isDisplayed 
    && asserters.isEnabled, 30000);
  })
  .then(function (textInput) {
    return textInput.sendKeys("hello@browserstack.com"+"\n");
  })
  .then(function () {
    return driver.waitForElementById('Text Output', asserters.isDisplayed 
    && asserters.isEnabled, 30000);
  })
  .then(function (textOutput) {
    return textOutput.text().then(function(value) {
      if (value === "hello@browserstack.com")
        assert(true);
      else
        assert(false);
    });
  })
  .fin(function() { 
    // Invoke driver.quit() after the test is done to indicate that the test is completed.
    return driver.quit(); 
  })
  .done();