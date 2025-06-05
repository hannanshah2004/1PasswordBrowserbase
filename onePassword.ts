import { Stagehand } from '@browserbasehq/stagehand';
import { fetchCredentials } from './onePasswordCredentials';
import { spotifyLogin } from './onePasswordSpotify';
import { onePasswordSignIn } from './onePasswordSignIn';
import { Browserbase } from '@browserbasehq/sdk';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

(async () => {
  const bb = new Browserbase({ apiKey: process.env.BROWSERBASE_API_KEY! });
  const file = fs.createReadStream('1Password.zip');
  const extension = await bb.extensions.create({ file });
  console.log(`Extension uploaded with ID: ${extension.id}`);
  const session = await bb.sessions.create({
    projectId: process.env.BROWSERBASE_PROJECT_ID!,
    extensionId: extension.id
  });
  console.log(`Browserbase session created with ID: ${session.id}`);

  const stagehand = new Stagehand({
    env: 'BROWSERBASE',
    apiKey: process.env.BROWSERBASE_API_KEY!,
    modelName: 'anthropic/claude-3-7-sonnet-latest',
    modelClientOptions: { apiKey: process.env.ANTHROPIC_API_KEY! },
    waitForCaptchaSolves: true,
    browserbaseSessionID: session.id
  });

  await stagehand.init();
  try {
    await onePasswordSignIn(stagehand);
    const { username, password } = await fetchCredentials(stagehand);
    await spotifyLogin(stagehand, username, password);
  } finally {
    await stagehand.close();
  }
})();
