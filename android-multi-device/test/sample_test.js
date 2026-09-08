var assert = require('assert');
const webdriver = require('selenium-webdriver');
const { BrowserStackSdk } = require('browserstack-node-sdk');

// This sample demonstrates the browserstack-node-sdk's multi-driver feature:
// building TWO concurrent App Automate WebDriver sessions from a single
// Node process, one per device configured in browserstack.yml
// (`platforms` for the primary, `additionalPlatforms` for the secondary).
//
// The key pattern is calling `BrowserStackSdk.setDriverLabel('<label>')`
// immediately before each `new webdriver.Builder().build()` call, so the SDK
// knows which capability set (and which `label`) to build that session with.
// Both devices are built before either is used, and both stay open and
// interactable concurrently until they are quit in `finally`.
async function bstackMultiDeviceSampleTest() {
  let driverA, driverB;
  try {
    // Build the primary device (label must match a `platforms` entry in browserstack.yml)
    BrowserStackSdk.setDriverLabel('driver#1');
    driverA = await new webdriver.Builder().build();

    // Build the secondary device (label must match an `additionalPlatforms` entry)
    // — both sessions are now live concurrently.
    BrowserStackSdk.setDriverLabel('driver#2');
    driverB = await new webdriver.Builder().build();

    // Interact with each device independently while both sessions are open
    const sourceA = await driverA.getPageSource();
    const sourceB = await driverB.getPageSource();
    assert(sourceA.length > 0);
    assert(sourceB.length > 0);

    await driverA.executeScript(
      'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Device A responded correctly"}}'
    );
    await driverB.executeScript(
      'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Device B responded correctly"}}'
    );
  } catch (e) {
    if (driverA) {
      await driverA
        .executeScript(
          'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "See error logs"}}'
        )
        .catch(() => {});
    }
    if (driverB) {
      await driverB
        .executeScript(
          'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "See error logs"}}'
        )
        .catch(() => {});
    }
    throw e;
  } finally {
    if (driverA) {
      await driverA.quit();
    }
    if (driverB) {
      await driverB.quit();
    }
  }
}

bstackMultiDeviceSampleTest();
