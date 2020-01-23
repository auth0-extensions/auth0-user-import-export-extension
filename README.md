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
