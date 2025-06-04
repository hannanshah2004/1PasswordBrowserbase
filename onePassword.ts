import { Stagehand } from '@browserbasehq/stagehand';
import { fetchCredentials } from './onePasswordCredentials';
import { spotifyLogin } from './onePasswordSpotify';
import dotenv from 'dotenv';

dotenv.config();

(async () => {
  const stagehand = new Stagehand({
    env: 'BROWSERBASE',
    apiKey: process.env.BROWSERBASE_API_KEY!,
    projectId: process.env.BROWSERBASE_PROJECT_ID!,
    modelName: 'anthropic/claude-3-7-sonnet-latest',
    modelClientOptions: { apiKey: process.env.ANTHROPIC_API_KEY! },
    waitForCaptchaSolves: true,
    browserbaseSessionCreateParams: {
      projectId: process.env.BROWSERBASE_PROJECT_ID!,
      browserSettings: {
        solveCaptchas: true,
      },
      proxies: false,
    },
  });

  await stagehand.init();

  try {
    const { username, password } = await fetchCredentials(stagehand);
    await spotifyLogin(stagehand, username, password);
  } finally {
    await stagehand.close();
  }
})();
