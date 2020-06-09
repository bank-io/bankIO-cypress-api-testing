
const puppeteer = require('./puppeteer');

async function doBBVASandboxLogin(url, options) {
  const { browser, page } = await puppeteer.newPage(options);
  
  try {
    await page.goto(url);

    await page.waitFor('input[name="username"]');
    await page.type('input[name="username"]', "user1");

    await page.waitFor('input[name="password"]');
    await page.type('input[name="password"]', "1234");
    
    const returnToTPPElement = await page.$x("//span[contains(., 'Submit')]");
    await returnToTPPElement[0].click();

    const firstRequest = await page.waitForRequest((request) => {
      return request.url().includes("https://cypress.bankio.local/openbanking/callback") && request.method() === "GET";
    });

    await browser.close();

    return firstRequest.url();
  } catch (e) {
    console.error(e);

    await page.screenshot({
      path: "./cypress/screenshots/bbva.jpg",
      type: "jpeg",
      fullPage: true
    });
  } finally {
    await browser.close();
  }
}

module.exports = {
    doBBVASandboxLogin
}