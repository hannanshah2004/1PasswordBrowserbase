# Browserbase <-> 1Password Automation

This project uses Browserbase and Stagehand to automate:
- Logging into 1Password Extension (`OnePasswordSignIn.ts`).
- Logging into Spotify with the retrieved credentials (`onePasswordSpotify.ts`).

## Prerequisites
- Create a `.env` file with:
  ```env
  SEARCH_INPUT=<1Password item name>
  EMAIL=<1Password email>
  SECRET_KEY=<1Password secret key>
  MASTER_PASSWORD=<1Password master password>
  BROWSERBASE_API_KEY=<Browserbase API key>
  BROWSERBASE_PROJECT_ID=<Browserbase project ID>
  ANTHROPIC_API_KEY=<Anthropic API key>
  SPOTIFY_LOGIN_URL=<Spotify login URL>
  ```

## Usage
1. Install dependencies: `npm install`
2. Run the automation: `npm start`

## Project Structure
- `onePassword.ts`: Entry point that initializes Stagehand and orchestrates the flow.
- `onePasswordSignIn.ts`: Loads into 1Password extension and Signs In.
- `onePasswordSpotify.ts`: Automates Spotify login with fetched credentials.

