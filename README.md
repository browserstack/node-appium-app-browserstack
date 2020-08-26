# node-appium-app-browserstack

This repository demonstrates how to run Appium NodeJS tests on BrowserStack App Automate.

## Setup

### Requirements

1. Node.js

    - If not installed, install Node.js from [here](https://nodejs.org/en/download/)

    - Ensure you have node & npm installed by running `node -v` & `npm -v`

### Install the dependencies

To install the dependencies switch to `android/` or `ios/` folder and run the following command :

```
npm install
```

## Getting Started

Getting Started with Appium tests in NodeJS on BrowserStack couldn't be easier!

### Upoad your Android or iOS App

Upload your Android app (.apk or .aab file) or iOS app (.ipa file) to BrowserStack servers using our REST API. Here is an example cURL request :

```
curl -u "YOUR_USERNAME:YOUR_ACCESS_KEY" \
-X POST "https://api-cloud.browserstack.com/app-automate/upload" \
-F "file=@/path/to/apk/file"
```

Ensure that @ symbol is prepended to the file path in the above request. Please note the `app_url` value returned in the API response. We will use this to set the application under test while configuring the test later on.

**Note**: If you do not have an .apk or .ipa file and are looking to simply try App Automate, you can download and test using our [sample Android app](https://www.browserstack.com/app-automate/sample-apps/android/WikipediaSample.apk) or [sample iOS app](https://www.browserstack.com/app-automate/sample-apps/ios/BStackSampleApp.ipa).

### **Run first test :**

Open `BrowserStackSampleAndroid.js` file in Android folder or `BrowserStackSampleiOS.js` in ios folder

- Replace `YOUR_USERNAME` & `YOUR_ACCESS_KEY` with your BrowserStack access credentials

- Replace `bs://<app-id>` wkth the URL obtained from app upload step

- Set the device and OS version

- If you have uploaded your own app update the test case

- Run `node BrowserStackSampleAndroid.js` or `node BrowserStackSampleiOS.js`

For more details, refer to our documentation - [Get Started with your first test on App Automate](https://www.browserstack.com/docs/app-automate/appium/getting-started/nodejs)

### **Use Local testing for apps that access resources hosted in development or testing environments :**

Refer to our documentation - [Get Started with Local testing on App Automate](https://www.browserstack.com/docs/app-automate/appium/getting-started/nodejs/local-testing)

## Integration with other NodeJS frameworks

For other NodeJS frameworks samples, refer to following repositories :

- [WebdriverIO](https://github.com/browserstack/webdriverio-appium-app-browserstack)

Note: For other test frameworks supported by App-Automate refer our [Developer documentation](https://www.browserstack.com/docs/)

## Getting Help

If you are running into any issues or have any queries, please check [Browserstack Support page](https://www.browserstack.com/support/app-automate) or [get in touch with us](https://www.browserstack.com/contact?ref=help).
