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
    return driver.waitForElementById('Text Button', asserters.isDisplayed && asserters.isEnabled, 30000);
  })
  .then(function (textButton) {
    return textButton.click();
  })
  .then(function () {
    return driver.waitForElementById('Text Input', asserters.isDisplayed && asserters.isEnabled, 30000);
  })
  .then(function (textInput) {
    return textInput.sendKeys("hello@browserstack.com"+"\n");
  })
  .then(function () {
    return driver.waitForElementById('Text Output', asserters.isDisplayed && asserters.isEnabled, 30000);
  })
  .then(function (textOutput) {
    return textOutput.text().then(function(value) {
      if (value === "hello@browserstack.com")
        assert(true);
      else
        assert(false);
    });
  })
  .fin(function() { return driver.quit(); })
  .done();