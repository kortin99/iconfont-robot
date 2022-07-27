import puppeteer from "puppeteer-core";

const PROJECT_URL = `https://www.iconfont.cn/manage/index?manage_type=myprojects&projectId=`;

const OPEN_LINK_SELECTOR = '#J_project_detail > div:nth-child(2) > div > span.bar-link > span.text.open.btn.btn-normal';

const JS_LINK_SELECTOR = '#J_cdn_type_svgsymbol';
const CSS_LINK_SELECTOR = '#J_cdn_type_fontclass';
const UNICODE_LINK_SELECTOR = '#J_cdn_type_unicode';

async function openProjectPage(browser: puppeteer.Browser, projectId: string | number): Promise<puppeteer.Page> {
  const page = await browser.newPage();
  await page.goto(PROJECT_URL + `${projectId}`);
  await page.waitForNetworkIdle();
  if (!page.url().includes(PROJECT_URL)) {
    return await openProjectPage(browser, projectId);
  }
  return page;
}

export async function startFetch(browser: puppeteer.Browser, projectId: string | number, linkType = 'Symbol'): Promise<string | null> {
  const projectPage = await openProjectPage(browser, projectId);

  // if (!projectPage.url().includes(PROJECT_URL)) {
  //   return await startFetch(browser, projectId, linkType);
  // }

  // waiting open link button render succeed
  await projectPage.waitForSelector(OPEN_LINK_SELECTOR);

  // click open link button
  const openOnlineLinkBtn = await projectPage.$(OPEN_LINK_SELECTOR);
  openOnlineLinkBtn.click();

  // waiting online link render succeed
  await projectPage.waitForSelector(JS_LINK_SELECTOR);

  // get online link
  const type = linkType.toLowerCase().replace(/\s/g, '');
  switch (type) {
    case 'symbol': 
    case 'js':
      return await projectPage.$eval(JS_LINK_SELECTOR, (el: HTMLLinkElement) => el.href);
    case 'css':
    case 'fontclass': 
      return await projectPage.$eval(CSS_LINK_SELECTOR, (el: HTMLLinkElement) => el.href);
    case 'font':
    case 'unicode':
      return await projectPage.$eval(UNICODE_LINK_SELECTOR, (el: HTMLLinkElement) => el.href);
    default:
      return null
  }
}
