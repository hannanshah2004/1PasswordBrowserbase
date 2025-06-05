import { Stagehand } from '@browserbasehq/stagehand';
import 'dotenv/config';

const { SEARCH_INPUT, EMAIL, SECRET_KEY, MASTER_PASSWORD } = process.env;
if (!SEARCH_INPUT || !EMAIL || !SECRET_KEY || !MASTER_PASSWORD) {
  console.error('Error: SEARCH_INPUT, EMAIL, SECRET_KEY, and MASTER_PASSWORD environment variables must be set');
  process.exit(1);
}

export async function fetchCredentials(stagehand: Stagehand): Promise<{ username: string; password: string }> {
  const page = stagehand.page;

  // Derive the Chrome extension GUID from loaded pages
  const context = page.context();
  const urls = context.pages().map(p => p.url());
  const extensionPageUrl = urls.find(u => u.startsWith('chrome-extension://'));
  if (!extensionPageUrl) throw new Error('Extension page not found in context.pages()');
  const extGuid = new URL(extensionPageUrl).hostname;
  console.log('Using extension GUID:', extGuid);
  const extOrigin = `chrome-extension://${extGuid}`;

  await page.goto(`chrome-extension://${extGuid}/popup/index.html`, { timeout: 60000 });
  await page.waitForTimeout(5000);

  // Grant clipboard permissions so we can read without a prompt
  /*
  await page.context().grantPermissions(
    ['clipboard-read', 'clipboard-write'],
    { origin: extOrigin }
  );
  /*
  await page.act(`Type "${EMAIL!}" into the email field`);
  await page.waitForTimeout(1000);
  
  await page.act('Click the Continue button');
  await page.waitForTimeout(3000);
  await page.act(`Type "${SECRET_KEY!}" into the Secret Key field`);
  await page.act(`Type "${MASTER_PASSWORD!}" into the password field`);
  await page.act('Click the Sign In button');

  // Wait for login redirect and page load
  await page.waitForTimeout(5000);
  */

  // 1) Click the search box, type search query, and submit
  /*
  await page.waitForTimeout(5000);
  await page.act(`Type "${SEARCH_INPUT}" into the search 1Password field`);
  await page.act('Press Enter');
  await page.waitForTimeout(5000);

 
  await page.act(`Click the "${SEARCH_INPUT}" item in the search results`);
  await page.waitForTimeout(5000);
  */

  await page.act(`Click on the ${SEARCH_INPUT} item in the All Items list`);
  await page.waitForTimeout(5000);

  // Extract username and password from the opened item
  await page.act('Hover over the username field');
  await page.act('Click the Copy button next to the username');
  const username = await page.evaluate(() => navigator.clipboard.readText());

  // Copy password via clipboard
  await page.act('Hover over the password field');
  await page.act('Click the Copy button next to the password');
  const password = await page.evaluate(() => navigator.clipboard.readText());
  await page.waitForTimeout(3000);


  return { username, password };
}