
const puppeteer = require("puppeteer");

async function doMonzoSandboxLogin(url) {
  const browser = await puppeteer.launch({ headless: false, args: ["--disable-web-security"] });
  try {
    const page = await browser.newPage();

    await page.goto(url);
    // await page.waitForNavigation();

    // await Promise.all([page.click('a[aria-label="allow cookies"]')]);

    // await page.waitFor('[placeholder="User Name"]');
    // await page.type('[placeholder="User Name"]', "llr001");

    // await page.waitFor('[placeholder="Password"]');
    // await page.type('[placeholder="Password"]', "Password123");
    // await Promise.all([page.click("forgerock-auth-login button"), page.waitForNavigation()]);

    // await page.waitForSelector('form button[type="submit"]', { timeout: 10000 });
    // await Promise.all([page.click('form button[type="submit"]'), page.waitForNavigation()]);

    const firstRequest = await page.waitForRequest((request) => {
      return request.url().includes("https://cypress.bankio.local/openbanking/callback") && request.method() === "GET";
    });

    await browser.close();

    return firstRequest.url();
  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
  }
}

module.exports = {
    doMonzoSandboxLogin
}