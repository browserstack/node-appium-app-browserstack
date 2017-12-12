var wd = require('wd');
var assert = require('assert');
var asserters = wd.asserters;
var Q = wd.Q;

desiredCaps = {
  'browserstack.user' : 'BROWSERSTACK_USERNAME',
  'browserstack.key' : 'BROWSERSTACK_ACCESS_KEY',
  'build' : 'Node Android',
  'name': 'local_test',
  'device' : 'Google Pixel',
  'app' : 'bs://<hashed app-id>',
  'browserstack.debug' : true,
  'browserstack.local' : true
};

driver = wd.promiseRemote("http://hub-cloud.browserstack.com/wd/hub");

driver
  .init(desiredCaps)
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
  .fin(function() { return driver.quit(); })
  .done();
