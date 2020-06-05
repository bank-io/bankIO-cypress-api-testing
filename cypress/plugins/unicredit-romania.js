
const puppeteer = require("puppeteer");

async function doUniCreditRomaniaSandboxLogin(url) {
  const browser = await puppeteer.launch({ headless: false });
  try {
    const page = await browser.newPage();

    await page.goto(url);

    await page.waitFor('[name="UserName"]');
    await page.type('[name="UserName"]', "01PSD2Test");

    await page.waitFor('[name="Passwd"]');
    await page.type('[name="Passwd"]', "pw01PSD2Test");

    await Promise.all([page.click("button"), page.waitForNavigation()]);

    // const returnToTPPElement = await page.$x("//button[contains(., 'Grant Consents')]");
    // // const returnToTPPElement = await page.$x("//button[contains(., 'GRANT CONSENTS')]");
    // await returnToTPPElement[0].click();
    // await returnToTPPElement[0].click();

    await page.focus('#grant_consents-btn1');

    await page.keyboard.press('Enter');

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