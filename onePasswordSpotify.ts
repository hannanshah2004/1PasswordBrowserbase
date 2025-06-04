import { Stagehand } from '@browserbasehq/stagehand';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

export async function spotifyLogin(stagehand: Stagehand, username: string, password: string): Promise<void> {
  const page = stagehand.page;
  const TARGET_WEBSITE = process.env.SPOTIFY_LOGIN_URL!;

  await page.goto(TARGET_WEBSITE, { timeout: 60000 });
  if ((page as any).waitForCaptchaSolve) {
    await (page as any).waitForCaptchaSolve(60000);
  }
  await page.waitForTimeout(3000);

  await page.act(`Type "${username}" into the email or username field`);
  await page.waitForTimeout(6000);
  await page.act('Press Enter');
  if ((page as any).waitForCaptchaSolve) {
    await (page as any).waitForCaptchaSolve(60000);
  }
  await page.waitForTimeout(6000);

  await page.act('Click the "Log in with password" link or button');
  await page.waitForTimeout(6000);

  await page.act('Click the password field');
  await page.waitForTimeout(6000);  
  await page.act(`Type "${password}" into the password field`);  
  await page.waitForTimeout(3000);
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

  await page.screenshot({ path: 'spotify-login-result.png' });

  await stagehand.close()
}