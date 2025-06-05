import { Stagehand } from '@browserbasehq/stagehand';
import 'dotenv/config';

const { SEARCH_INPUT, EMAIL, SECRET_KEY, MASTER_PASSWORD } = process.env;
if (!SEARCH_INPUT || !EMAIL || !SECRET_KEY || !MASTER_PASSWORD) {
  console.error('Error: SEARCH_INPUT, EMAIL, SECRET_KEY, and MASTER_PASSWORD environment variables must be set');
  process.exit(1);
}

export async function fetchCredentials(stagehand: Stagehand): Promise<{ username: string; password: string }> {
  const page = stagehand.page;

  await page.goto('chrome-extension://aeblfdkhhhdcdjpifhhbdiojplfjncoa/popup/index.html', { timeout: 60000 });
  await page.waitForTimeout(3000);

  // Grant clipboard permissions so we can read without a prompt
  await page.context().grantPermissions([
    'clipboard-read',
    'clipboard-write'
  ], { origin: 'https://my.1password.com' });

  await page.act(`Type "${EMAIL!}" into the email field`);
  await page.waitForTimeout(1000);
  
  // Find and click the continue button using observe for better accuracy
  const [continueAction] = await page.observe('Click the Continue button');
  await page.act(continueAction);
  await page.waitForTimeout(3000);
  await page.act(`Type "${SECRET_KEY!}" into the Secret Key field`);
  await page.act(`Type "${MASTER_PASSWORD!}" into the password field`);
  await page.act('Click the Sign In button');

  // Wait for login redirect and page load
  await page.waitForTimeout(5000);

  // 1) Click the search box, type search query, and submit
  await page.waitForTimeout(3000);
  await page.act('Click the search in all vaults field');
  await page.act(`Type "${SEARCH_INPUT}" into the search in all vaults field`);
  await page.act('Press Enter');

  // 2) Observe and click the matching item
  const [clickInstruction] = await page.observe(
    `Click the "${SEARCH_INPUT}" item in the search results`
  );
  await page.act(clickInstruction);
  await page.waitForTimeout(3000);

  // Extract username and password from the opened item
  await page.act('Hover over the username field');
  await page.act('Click the Copy button next to the username');
  const username = await page.evaluate(() => navigator.clipboard.readText());

  // Copy password via clipboard
  await page.act('Hover over the password field');
  await page.act('Click the Copy button next to the password');
  const password = await page.evaluate(() => navigator.clipboard.readText());

  return { username, password };
}