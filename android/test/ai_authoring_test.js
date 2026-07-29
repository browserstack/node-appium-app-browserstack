var assert = require('assert');
const { Builder } = require('selenium-webdriver');

var buildDriver = function () {
  return new Builder().usingServer('http://127.0.0.1:4723/wd/hub').build();
};

async function aiAuthoringTest() {
  let driver = buildDriver();
  try {
    // Search using AI Agent commands
    await driver.executeScript(
      'browserstack_executor: {"action": "ai", "arguments": ["Tap on Search Wikipedia"]}'
    );
    await driver.executeScript(
      'browserstack_executor: {"action": "ai", "arguments": ["Type India in the search field"]}'
    );

    // Verify results
    await driver.executeScript(
      'browserstack_executor: {"action": "ai", "arguments": ["Verify search results are displayed"]}'
    );

    await driver.executeScript(
      'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "AI Authoring test passed"}}'
    );
  } catch (e) {
    await driver.executeScript(
      'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "AI Authoring test failed"}}'
    );
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}

aiAuthoringTest();
