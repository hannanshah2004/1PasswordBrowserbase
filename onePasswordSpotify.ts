import { Stagehand } from '@browserbasehq/stagehand';
import { z } from 'zod';

export async function spotifyLogin(stagehand: Stagehand): Promise<void> {
  const page = stagehand.page;
  const TARGET_WEBSITE = process.env.SPOTIFY_LOGIN_URL!;

  await page.goto(TARGET_WEBSITE, { timeout: 60000 });
  if ((page as any).waitForCaptchaSolve) {
    await (page as any).waitForCaptchaSolve(60000);
  }
  await page.waitForTimeout(3000);

  // Focus the email input field
  await page.click('input[placeholder="Email or username"]');
  await page.waitForTimeout(500);
  // Trigger 1Password extension fill (Ctrl+\ on Windows)
  await page.keyboard.press('Control+\\');
  await page.waitForTimeout(1000);
  // Navigate to and select the first suggestion
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2000);

  await page.waitForLoadState('networkidle');
  await page.act('Click the "Log in with a password" button');
  await page.waitForTimeout(6000);
  await page.waitForLoadState('networkidle');

  // Password is already autofilled, so submit form
  await page.act('Press Enter');
  if ((page as any).waitForCaptchaSolve) {
    await (page as any).waitForCaptchaSolve(60000);
  }
  await page.waitForTimeout(6000);

  const verifySchema = z.object({ success: z.boolean(), message: z.string() });
  const result = await page.extract({
    instruction: 'Check if the user is logged in to Spotify by looking for a profile or logout button',
    schema: verifySchema,
  });
  console.log(`Login ${result.success ? 'successful' : 'failed'}: ${result.message}`);

  await stagehand.close()
}