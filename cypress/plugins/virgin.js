
const puppeteer = require('./puppeteer');

async function doVirginSandboxLogin(url, options) {
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  
  try {
    await page.goto(url);

    await page.waitFor('input[name="username"]');
    await page.type('input[name="username"]', "Robin");

    await page.waitFor('input[name="password"]');
    await page.type('input[name="password"]', "Robin");

    await Promise.all([page.click('input[type="submit"][value="Proceed"]:not([disabled])'), page.waitForNavigation()]);

    await page.waitFor('input[name="security_question"]');
    await page.type('input[name="security_question"]', "Robin");
    await Promise.all([page.click('input[type="submit"][value="Continue"]:not([disabled])'), page.waitForNavigation()]);

    await page.waitForSelector("form[name='chooseAccounts'] input[type='checkbox']");
    await page.waitFor(1000);

    await page.evaluate(() => {
      document.querySelectorAll("form[name='chooseAccounts'] input[type='checkbox']").forEach((c) => c.click());
    });

    await Promise.all([page.click('input[type="submit"][value="Proceed"]:not([disabled])'), page.waitForNavigation()]);

    const firstRequest = await page.waitForRequest((request) => {
      return request.url().includes("https://cypress.bankio.local/openbanking/callback") && request.method() === "GET";
    });

    await browser.close();

    return firstRequest.url();
  } catch (e) {
    console.error(e);

    await page.screenshot({
      path: "./cypress/screenshots/virgin.jpg",
      type: "jpeg",
      fullPage: true
    });
  } finally {
    // await browser.close();
  }
}

module.exports = {
    doVirginSandboxLogin
}