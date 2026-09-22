# Multi-device (concurrent sessions) sample

This sample demonstrates how to run **two concurrent App Automate sessions from a single Node process** using the `browserstack-node-sdk`'s multi-driver feature, instead of the usual one-session-per-process pattern used in the [`android`](../android) sample.

## How it works

- Each device you want to drive concurrently gets a `label` in `browserstack.yml`: the first (primary) device is listed under `platforms`, every additional device under `additionalPlatforms`.
- In the test, call `BrowserStackSdk.setDriverLabel('<label>')` immediately before each `new webdriver.Builder().build()` call. This tells the SDK which capability set to use for that particular session.
- Build both sessions before interacting with either — both stay open and independently controllable (e.g. `getPageSource()`) at the same time, and are only torn down (`driver.quit()`) in a `finally` block once you're done with both.

See [`browserstack.yml`](./browserstack.yml) and [`test/sample_test.js`](./test/sample_test.js) for the full pattern.

## The one gotcha that matters: where `app` goes

The SDK reads the app capability differently for the primary device versus every secondary device:

- The **primary** device's `app` must stay a **top-level `app:` key** in `browserstack.yml` — the exact same field the single-device `android` sample uses. It must **not** be nested inside its own entry under `platforms:`.
- The **secondary** device's `app` goes under its own `additionalPlatforms[<n>].app` entry — that's the only place the SDK reads a per-platform `app` for anything other than the primary.

Getting this backwards (nesting the primary's `app` under `platforms[0].app` instead of top-level) fails silently on the very first `build()` call with:

```
TypeError: Target browser must be a string, but is undefined
```

This is because the SDK's capability-building code only ever reads the top-level `app` for the primary device; only the secondary device's app gets promoted from its per-platform entry.

**One more layer to this:** that top-level `app` promotion (auto-uploading a local `.apk` path) is itself only done for the primary device. The secondary's `additionalPlatforms[0].app` does NOT get auto-uploaded if it's a local path — it's passed straight through and BrowserStack's API rejects it with `[BROWSERSTACK_INVALID_APP_CAP]`. `upload_apps.js` (run automatically by `npm run sample-test`) works around this: it uploads any local `.apk` path still in `browserstack.yml` and rewrites the file in place with the resulting `bs://` id, for both devices. Safe to re-run - once a path is replaced with a real id it's left alone.

## Backend

`ride-request-customer.apk` and `ride-request-rider.apk` are a small Uber-style ride-hailing
demo: the customer requests a ride, the rider accepts, then starts the ride using an OTP read
off the customer app's screen. Both apps talk to a local backend for this state
(idle → requested → accepted → started) — see [`backend/server.js`](./backend/server.js) for
the endpoints. Start it before running the apps:

```bash
cd backend
npm install
npm start
```

It listens on `http://localhost:8787` by default (override with `PORT=xxxx npm start`) and is
reached by the BrowserStack devices through BrowserStack Local, which is why
`browserstackLocal: true` is set in [`browserstack.yml`](./browserstack.yml).

## Running it

From this folder:

```bash
npm install
npm run sample-test
```

`sample-test` runs `upload_apps.js` first (uploads both apps if they're still local paths, see the gotcha above) then the test itself. To just upload without running the test: `npm run upload-apps`.

You'll need `BROWSERSTACK_USERNAME` and `BROWSERSTACK_ACCESS_KEY` set as environment variables (or filled directly into `browserstack.yml`). Results, including both concurrent sessions, are visible on the [App Automate dashboard](https://app-automate.browserstack.com/dashboard).

This sample uses two different, independent apps — `ride-request-customer.apk` (primary device) and `ride-request-rider.apk` (secondary device), a small ride-hailing style demo — to show the multi-driver feature in a realistic two-different-apps setting, not just two copies of the same app.
