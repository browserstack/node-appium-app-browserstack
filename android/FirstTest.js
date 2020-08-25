var wd = require('wd');
var assert = require('assert');
var asserters = wd.asserters;

desiredCaps = {
  // Set your BrowserStack access credentials
  'browserstack.user' : 'YOUR_USERNAME',
  'browserstack.key' : 'YOUR_ACCESS_KEY',

  // Set URL of the application under test
  'app' : 'bs://<hashed app-id>',

  // Specify device and os_version for testing
  'device' : 'Google Pixel 3',
  'os_version' : '9.0',

  // Set other BrowserStack capabilities
  'project' : 'First NodeJS project',
  'build' : 'Node Android',
  'name': 'first_test',
};

driver = wd.promiseRemote("http://hub-cloud.browserstack.com/wd/hub");

driver
  .init(desiredCaps)
  .then(function () {
    return driver.waitForElementByAccessibilityId(
      'Search Wikipedia', asserters.isDisplayed && asserters.isEnabled, 30000
      );
  })
  .then(function (searchElement) {
    return searchElement.click();
  })
  .then(function () {
    return driver.waitForElementById(
      'org.wikipedia.alpha:id/search_src_text', asserters.isDisplayed && asserters.isEnabled, 30000
      );
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
