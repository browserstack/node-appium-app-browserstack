# node-appium-app-browserstack

This repository demonstrates how to run Appium NodeJS tests on BrowserStack App Automate.

## Setup

### Requirements

1. Node.js

    - If not installed, install Node.js from [here](https://nodejs.org/en/download/)

    - Ensure you have node & npm installed by running `node -v` & `npm -v`

### Install the dependencies

To install the dependencies run the following command in the project's base directory :

```
- Open `Android` or in `ios` folder

- Run `npm install`
```

## Getting Started

Getting Started with Appium tests in NodeJS on BrowserStack couldn't be easier!

### Run your first test :

Open `Android` or in `ios` folder

- If you have uploaded your app then add the app id to the `browserstack.yml` config file, or you can directly specify the path to your app in the `browserstack.yml` file.

- Run `npm run sample-test`

- You can access the test execution results, and debugging information such as video recording, network logs on [App Automate dashboard](https://app-automate.browserstack.com/dashboard)

---

### **Use Local testing for apps that access resources hosted in development or testing environments :**

Open `Android` or in `ios` folder

- Ensure that `browserstackLocal` capability is set to `true` in the `browserstack.yml` file.

- If you have uploaded your app then add the app id to the `browserstack.yml` config file, or you can directly specify the path to your app in the `browserstack.yml` file.

- Run `npm run sample-local-test`

- You can access the test execution results, and debugging information such as video recording, network logs on [App Automate dashboard](https://app-automate.browserstack.com/dashboard)

## Integration with other NodeJS frameworks

For other NodeJS frameworks samples, refer to following repositories :

- [WebdriverIO](https://github.com/browserstack/webdriverio-appium-app-browserstack)

Note: For other test frameworks supported by App-Automate refer our [Developer documentation](https://www.browserstack.com/docs/)

## Getting Help

If you are running into any issues or have any queries, please check [Browserstack Support page](https://www.browserstack.com/support/app-automate) or [get in touch with us](https://www.browserstack.com/contact?ref=help).
