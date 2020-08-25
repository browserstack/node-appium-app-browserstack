var wd = require('wd');
var assert = require('assert');
var asserters = wd.asserters;
var Q = wd.Q;

desiredCaps = {
  // Set your BrowserStack access credentials
  'browserstack.user' : 'YOUR_USERNAME',
  'browserstack.key' : 'YOUR_ACCESS_KEY',

    // Set URL of the application under test
  'app' : 'bs://<app-id>',

  // Specify device and os_version for testing
  'device' : 'iPhone 11 Pro',
  'os_version' : '13',

  // Set other BrowserStack capabilities
  'project' : 'First NodeJS project',
  'build' : 'Node iOS',
  'name': 'first_test'
};

// Initialize the remote Webdriver using BrowserStack remote URL
// and desired capabilities defined above
driver = wd.promiseRemote("http://hub-cloud.browserstack.com/wd/hub");

// Test case for the BrowserStack sample Android app. 
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