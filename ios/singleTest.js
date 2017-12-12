var wd = require('wd');
var assert = require('assert');
var asserters = wd.asserters;
var sleep = require('sleep');
var Q = wd.Q;

desiredCaps = {
  'browserstack.user' : 'BROWSERSTACK_USERNAME',
  'browserstack.key' : 'BROWSERSTACK_ACCESS_KEY',
  'build' : 'Node iOS',
  'name': 'single_test',
  'device' : 'iPhone 7 Plus',
  'app' : 'bs://<hashed app-id>',
  'browserstack.debug' : true
};
driver = wd.promiseRemote("http://hub-cloud.browserstack.com/wd/hub");

driver
  .init(desiredCaps)
  .then(function () {
    return driver.waitForElementById('Log In', asserters.isDisplayed && asserters.isEnabled, 30000);
  })
  .then(function (loginButton) {
    return loginButton.click();
  })
  .then(function () {
    return driver.waitForElementById('Email address', asserters.isDisplayed && asserters.isEnabled, 30000);
  })
  .then(function (emailInput) {
    return emailInput.sendKeys("hello@browserstack.com");
  })
  .then(function () {
    return driver.waitForElementById('Next', asserters.isDisplayed, 30000);
  })
  .then(function (nextButton) {
    return nextButton.click().then(function() {
      sleep.sleep(5);
    });
  })
  .then(function() {
    return driver.waitForElementsByXPath("//XCUIElementTypeStaticText", asserters.isDisplayed, 30000);
  })
  .then(function (textElements) {
    return Q().then(function () {
      return textElements.map(function (textElement) {
        if (textElement === null) {
          return;
        } else {
          return textElement.text().then(function(value) {
            if (value.indexOf('not registered') !== -1) {
              console.log(value);
              assert(value.indexOf('This email address is not registered on WordPress.com') !== -1);
            }
          });
        }
      })
    }).all()
  })
  .fin(function() { return driver.quit(); })
  .done();
