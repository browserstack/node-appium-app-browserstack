let wd = require('wd');
let assert = require('assert');
let asserters = wd.asserters;

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
    "sessionName" : "BStack first_test",
    "debug" : "true",
    "userName" : "YOUR_USERNAME",
    "accessKey" : "YOUR_ACCESS_KEY"
  }
};

// Initialize the remote Webdriver using BrowserStack remote URL
// and desired capabilities defined above
driver = wd.promiseRemote("http://hub.browserstack.com/wd/hub");

// Test case for the BrowserStack sample Android app. 
// If you have uploaded your app, update the test case here. 
driver.init(desiredCaps)
  .then(function () {
    return driver.waitForElementByAccessibilityId(
      'Search Wikipedia', asserters.isDisplayed 
      && asserters.isEnabled, 30000);
  })
  .then(function (searchElement) {
    return searchElement.click();
  })
  .then(function () {
    return driver.waitForElementById(
      'org.wikipedia.alpha:id/search_src_text', asserters.isDisplayed 
      && asserters.isEnabled, 30000);
  })
  .then(function (searchInput) {
    return searchInput.sendKeys("BrowserStack");
  })
  .then(function () {
    return driver.elementsByClassName('android.widget.TextView');    
  })
  .then(function (search_results) {
    assert(search_results.length > 0);
  })
  .fin(function() { 
    // Invoke driver.quit() after the test is done to indicate that the test is completed.
    return driver.quit(); 
  })
  .done();
