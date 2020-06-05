
const puppeteer = require("puppeteer");

async function doBCRSandboxLogin(url) {
  const browser = await puppeteer.launch({ headless: false });
  try {
    const page = await browser.newPage();

    await page.goto(url);

    await page.waitFor('select[name="user"]');
    
    await page.select('select[name="user"]', '00351bbe-837d-11e9-bc42-526af7764f64')

    await Promise.all([page.click(`button.loginButton`), page.waitForNavigation()]);

    const returnToTPPElement = await page.$x("//button[contains(., 'Log in')]");
    await returnToTPPElement[0].click();

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
    doBCRSandboxLogin
}