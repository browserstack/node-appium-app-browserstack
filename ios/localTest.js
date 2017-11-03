var wd = require('wd');
var assert = require('assert');
var asserters = wd.asserters;
var Asserter = wd.Asserter;

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

desiredCaps = {
  'browserstack.user' : 'BROWSERSTACK_USERNAME',
  'browserstack.key' : 'BROWSERSTACK_ACCESS_KEY',
  'build' : 'Node iOS',
  'name': 'local_test',
  'device' : 'iPhone 7 Plus',
  'app' : 'bs://<hashed app-id>',
  'browserstack.debug' : true,
  'browserstack.local' : true,
  'realMobile' : true
};

var customTextNonEmpty = new Asserter(
  function(target) {
    return target
      .text().then(function(text) {
        text.should.have.length.above(0);
        return text;
      })
      .catch(tagChaiAssertionError);
  }
);

driver = wd.promiseRemote("http://hub-cloud.browserstack.com/wd/hub");

driver
  .init(desiredCaps)
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
  .fin(function() { return driver.quit(); })
  .done();
