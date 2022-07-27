import puppeteer from "puppeteer-core";
import path from 'path';
import 'dotenv/config';
import { startLogin } from "./login";
import { startFetch } from "./fetch";

export async function getLink(): Promise<string | null> {
  if (!process.env.CHROME_PATH) {
    throw new Error('"CHROME_PATH" must be configured in [.env] file!');
  }
  console.time('totalTime');
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH,
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
    ],
  });
  await startLogin(browser);
  const result = await startFetch(browser, 3423219, 'Symbol');
  console.log('result: ', result);
  await browser.close();
  console.timeEnd('totalTime');
  return result;
}
