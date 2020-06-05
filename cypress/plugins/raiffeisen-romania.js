
const puppeteer = require("puppeteer");

async function doRaiffeisenRomaniaSandboxLogin(url) {
  const browser = await puppeteer.launch({ headless: false });
  try {
    const page = await browser.newPage();

    await page.goto(url);
    await page.waitForNavigation();

    await page.waitFor('[placeholder="PSU ID"]');
    await page.type('[placeholder="PSU ID"]', "9999999997");

    await Promise.all([page.click("button"), page.waitForNavigation()]);

    const returnToTPPElement = await page.$x("//button[contains(., 'Return to TPP')]");
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
    doRaiffeisenRomaniaSandboxLogin
}