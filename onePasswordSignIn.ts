import { Stagehand } from '@browserbasehq/stagehand';
import 'dotenv/config';

export async function onePasswordSignIn(stagehand: Stagehand, extensionId: string): Promise<Stagehand> {
  const page = stagehand.page;
  const EMAIL = process.env.EMAIL!;
  const SECRET_KEY = process.env.SECRET_KEY!;
  const MASTER_PASSWORD = process.env.MASTER_PASSWORD!;

  // Give the extension time to initialize before we navigate
  await page.waitForTimeout(5000);

  // Navigate to a host page to allow extension content scripts to inject
  await page.goto('https://example.com', { timeout: 60000, waitUntil: 'networkidle' });

  // Open the 1Password popup page directly in the same context so the extension is available
  const popup = await page.context().newPage();
  await popup.goto(
    `chrome-extension://${extensionId}/app/app.html#/page/welcome?language=en`,
    { timeout: 60000, waitUntil: 'networkidle' }
  );
  await popup.waitForLoadState('networkidle');
  console.log('Popup URL:', popup.url());

  // Wait for the Continue button to appear before clicking
  await page.waitForSelector('text=Continue', { timeout: 30000 });
  await page.act('Click the Continue button');

  // 2) Click "Sign in" to reach the account form
  await page.act('Click the Sign in button');
  await page.waitForLoadState('networkidle');

  // 3) Enter email
  await page.act(`Type "${EMAIL}" into the Email field`);
  await page.act('Click the Continue button');
  await page.waitForLoadState('networkidle');

  // 5) Enter Secret Key
  await page.act(`Type "${SECRET_KEY}" into the Secret Key field`);

  // 6) Enter Master Password
  await page.act(`Type "${MASTER_PASSWORD}" into the Password field`);

  // 7) Click Sign In
  await page.act('Click the Sign In button');
  await page.waitForTimeout(2000);

  return stagehand;
} 