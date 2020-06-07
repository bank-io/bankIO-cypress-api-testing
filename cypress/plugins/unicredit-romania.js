
const puppeteer = require('./puppeteer');

async function doUniCreditRomaniaSandboxLogin(url, options) {
  const browser = await puppeteer.launch(options);
  try {
    const page = await browser.newPage();

    await page.goto(url);

    await page.waitFor('[name="UserName"]');
    await page.type('[name="UserName"]', "01PSD2Test");

    await page.waitFor('[name="Passwd"]');
    await page.type('[name="Passwd"]', "pw01PSD2Test");

    await Promise.all([page.click("button"), page.waitForNavigation()]);

    await page.waitFor(3000);
    // const returnToTPPElement = await page.$x("//button[contains(., 'Grant Consents')]:not([disabled])");
    // // // const returnToTPPElement = await page.$x("//button[contains(., 'GRANT CONSENTS')]");
    // await returnToTPPElement[0].click();
    // await returnToTPPElement[0].click();

    await page.$eval('#grant_consents-btn1', elem => elem.click());

    // await page.evaluate(() => { document.querySelector('#grant_consents-btn1').click(); });

    // await page.waitFor(1000);
    // await page.evaluate(() => { document.querySelector('#grant_consents-btn1').click(); });

    // await page.focus('#grant_consents-btn1');

    // await page.keyboard.press('Enter');

    // await page.click("#grant_consents-btn1");

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
    doUniCreditRomaniaSandboxLogin
}