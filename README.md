# Auth0 user import and export extension

This extension makes it possible to import and export users from Auth0.

## Running Locally

 - Be sure you have [ngrok](https://ngrok.com/) installed.
 - Start ngrok on port 3000 `ngrok http 3000` and take note of your ngrok HTTP URL
 - Create a `Client` in your account with `read:connections`, `create:users`, `read:users` and `create:passwords_checking_job` access to the Auth0 Management API. 
 - Create a `config.json` file under `./server/` containing the following settings:

```json
{
  "EXTENSION_SECRET": "any-random-value-will-do",
  "AUTH0_DOMAIN": "YOUR_DOMAIN",
  "AUTH0_CLIENT_ID": "YOUR_CLIENT_ID",
  "AUTH0_CLIENT_SECRET": "YOUR_CLIENT_SECRET",
  "WT_URL": "http://YOUR_NGROK",
  "AUTH0_RTA": "https://auth0.auth0.com"
}
```

- Install dependencies and run the extension under **node 8**:

```bash
nvm use 8
yarn install
npm run serve:dev
```
- To view the extension visit your ngrok URL (note that you are using the extension outside of Auth0 dashboard).
- If you get errors regarding nonce or token, try logging out of Auth0, clearing site data for the extension, logging back into Auth0, and then re-visiting the extension.

## Building for Production

```
npm run build
```

## Adding or Updating Dependencies

```
yarn add "some-dep@some-version" --ignore-engines
```

## Release Process

Deployment is currently done using this tool: https://auth0-extensions.us8.webtask.io/extensions-deploy

First bump the version in `package.json` and in `webtask.json`

Then build the extension:

```bash
nvm use 8
yarn install
npm run build
```

Bundle file (`auth0-user-import-export.extension.VERSION.js`) is found in `/dist`
Asset files are also found in `/dist`

Follow the instructions in the deployment tool.  This tool will also automatically generate a PR in the `auth0-extensions` repo.  Only after the PR is merged will the extension be available in production.  Before merging the PR you can use this tool to test the upgrade: https://github.com/auth0-extensions/auth0-extension-update-tester by overriding the `extensions.json` file that is fetched by the dashboard.