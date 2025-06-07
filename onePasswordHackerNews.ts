import { Stagehand } from '@browserbasehq/stagehand';
import { z } from 'zod';

export async function hackerNewsLogin(stagehand: Stagehand): Promise<void> {
  const page = stagehand.page;
  const HACKER_LOGIN_URL = process.env.HACKER_LOGIN_URL!;

  // Navigate to the Hacker News login page
  await page.goto(HACKER_LOGIN_URL, { timeout: 60000 });

  await page.waitForTimeout(3000);

  // Click the Login button
  await page.act('Click the login button');

  // Click the username field under the Login title
  await page.act('Click the username field under the Login title');
  await page.waitForTimeout(1000);

  // Trigger 1Password extension fill (Ctrl+\ on Windows)
  await page.keyboard.press('Control+\\');
  await page.waitForTimeout(1000);
  // Navigate to and select the first suggestion
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2000);

  const verifySchema = z.object({ success: z.boolean(), message: z.string() });
  const result = await page.extract({
    instruction: 'Check if the user is logged in to Hacker News by looking for a profile or logout button',
    schema: verifySchema,
  });
  console.log(`Login ${result.success ? 'successful' : 'failed'}: ${result.message}`);

}