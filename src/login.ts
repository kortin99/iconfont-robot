import puppeteer from "puppeteer-core";

// iconfont.cn login selectors
const PHONE_INPUT_SELECTOR = '#userid';
const PHONE_PASSWORD_INPUT_SELECTOR = '#password';
const PHONE_LOGIN_SELECTOR = 'button[type=submit]';

// github login selectors
const GITHUB_REDIRECT_SELECTOR = 'a[href=\"/api/login/github?redirect=\"]';
const GITHUB_INPUT_SELECTOR = '#login_field';
const GITHUB_PASSWORD_INPUT_SELECTOR = '#password';
const GITHUB_LOGIN_SELECTOR = 'input[type=submit]';

async function openLoginPage(browser: puppeteer.Browser): Promise<puppeteer.Page> {
  const page = await browser.newPage();
  await page.goto('https://www.iconfont.cn/login');
  return page;
}

async function loginWithPhone(loginPage: puppeteer.Page, phone: string, password: string): Promise<void> {
  // waiting login button element render succeed
  await loginPage.waitForSelector(PHONE_LOGIN_SELECTOR);

  // input phone number and password
  const userIdElm = await loginPage.$(PHONE_INPUT_SELECTOR);
  await userIdElm.type(phone);
  const passwordElm = await loginPage.$(PHONE_PASSWORD_INPUT_SELECTOR);
  await passwordElm.type(password);

  // click login button
  const loginBtnElm = await loginPage.$(PHONE_LOGIN_SELECTOR);
  await loginBtnElm.click();
}

async function loginWithGithub(loginPage: puppeteer.Page, githubAccount: string, password: string): Promise<void> {
  // waiting github redirect button element render succeed
  await loginPage.waitForSelector(GITHUB_REDIRECT_SELECTOR);

  // redirect to github login page
  const githubRedirectElm = await loginPage.$(GITHUB_REDIRECT_SELECTOR);
  await githubRedirectElm.click();

  // waiting github login page render succeed
  await loginPage.waitForNavigation();
  await loginPage.waitForSelector(GITHUB_LOGIN_SELECTOR);

  // input github account and password
  await loginPage.waitForSelector(GITHUB_PASSWORD_INPUT_SELECTOR);
  const userIdElm = await loginPage.$(GITHUB_INPUT_SELECTOR);
  await userIdElm.type(githubAccount);
  const passwordElm = await loginPage.$(GITHUB_PASSWORD_INPUT_SELECTOR);
  await passwordElm.type(password);

  // click sign in button
  const loginBtnElm = await loginPage.$(GITHUB_LOGIN_SELECTOR);
  await loginBtnElm.click();

  await loginPage.waitForNavigation();
}

interface LoginOptions {
  phone?: string;
  github?: string;
  password: string;
}

function getFromDotEnv(): LoginOptions {
  const phone = process.env.PHONE;
  const password = process.env.PASSWORD;
  const github = process.env.GITHUB;

  if (!password) {
    throw new Error('"PASSWORD" must be configured in [.env] file!');
  } else if (!phone && !github) {
    throw new Error('One of "PHONE" or "GITHUB" must be configured in [.env] file!');
  }

  return {
    phone,
    password,
    github
  }
}

export async function startLogin(browser: puppeteer.Browser, loginOptions?: LoginOptions): Promise<void> {
  const loginPage = await openLoginPage(browser);

  let { phone, github, password } = loginOptions || {};
  if (!password || !(phone || github)) {
    ({ phone, github, password } = getFromDotEnv());
  }

  // phone login first
  if (phone) {
    await loginWithPhone(loginPage, phone, password);
    return;
  }
  if (github) {
    await loginWithGithub(loginPage, github, password);
  }
}
