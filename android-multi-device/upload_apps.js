// Uploads any local .apk path still in browserstack.yml to BrowserStack and rewrites
// browserstack.yml in place with the resulting bs:// id. Needed because only the PRIMARY
// device's local-path app gets auto-uploaded by the SDK itself (handleApp() only reads the
// top-level `app` key) — the SECONDARY device's `additionalPlatforms[0].app` does not, so a
// local .apk path there is passed straight through and rejected by BrowserStack's API.
// Safe to run every time: once a path is replaced with bs://..., it no longer matches and is
// left alone, so re-running does not re-upload.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const USERNAME = process.env.BROWSERSTACK_USERNAME;
const ACCESS_KEY = process.env.BROWSERSTACK_ACCESS_KEY;

if (!USERNAME || !ACCESS_KEY) {
	console.error('Set BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY before running this.');
	process.exit(1);
}

function uploadApp(apkPath) {
	const raw = execFileSync(
		'curl',
		['-s', '-u', `${USERNAME}:${ACCESS_KEY}`, '-X', 'POST', 'https://api-cloud.browserstack.com/app-automate/upload', '-F', `file=@${apkPath}`],
		{ encoding: 'utf8' },
	);
	const response = JSON.parse(raw);
	if (!response.app_url) {
		throw new Error(`Upload failed for ${apkPath}: ${raw}`);
	}
	console.log(`Uploaded ${apkPath} -> ${response.app_url}`);
	return response.app_url;
}

const ymlPath = path.join(__dirname, 'browserstack.yml');
let yml = fs.readFileSync(ymlPath, 'utf8');

const localAppPattern = /app:\s*(\.\/[^\s#]+\.apk)/g;
const localPaths = [...new Set([...yml.matchAll(localAppPattern)].map((m) => m[1]))];

if (localPaths.length === 0) {
	console.log('No local .apk paths left in browserstack.yml - already using uploaded app ids.');
} else {
	for (const localPath of localPaths) {
		const resolved = path.join(__dirname, localPath);
		if (!fs.existsSync(resolved)) {
			throw new Error(`App file not found: ${resolved}`);
		}
		const appUrl = uploadApp(resolved);
		yml = yml.split(`app: ${localPath}`).join(`app: ${appUrl}`);
	}
	fs.writeFileSync(ymlPath, yml);
	console.log('browserstack.yml updated with uploaded app ids.');
}
