
const puppeteer = require('./puppeteer');

async function doRBSSandboxLogin(url, options) {
  const browser = await puppeteer.launch(options);
  try {
    const page = await browser.newPage();

    await page.goto(url);
    await page.waitForNavigation();

    await page.waitFor('[name="customer-number"]');
    await page.type('[name="customer-number"]', "123456789012");

    // await Promise.all([, page.waitForNavigation()]);
    await page.click('button[data-action="continue"]:not([disabled])')

    await page.waitFor('[name="pin-1"]');
    await page.type('[name="pin-1"]', "5");
    await page.type('[name="pin-2"]', "7");
    await page.type('[name="pin-3"]', "2");

    await page.type('[name="password-1"]', "4");
    await page.type('[name="password-2"]', "3");
    await page.type('[name="password-3"]', "6");

    await Promise.all([page.click('button[data-action="authenticate"]:not([disabled])'), page.waitForNavigation()]);

    await page.waitFor('#account-list');
    await page.click("#account-list .row-element:nth-of-type(1)");
    await page.click("#account-list .row-element:nth-of-type(2)");

    await Promise.all([page.click('#approveButton'), page.waitForNavigation()]);

    const firstRequest = await page.waitForRequest((request) => {
      return request.url().includes("https://cypress.bankio.local/openbanking/callback") && request.method() === "GET";
    });

    await browser.close();

    return firstRequest.url();
  } catch (e) {
    console.error(e);
  } finally {
    // await browser.close();
  }
}

module.exports = {
    doRBSSandboxLogin
}