const puppeteer = require("puppeteer");

async function doDanskeSandboxLogin(url) {
  const browser = await puppeteer.launch({ headless: false, args: ["--disable-web-security"] });
  try {
    const page = await browser.newPage();

    await page.goto(url);

    await page.waitFor('input[name="FakeLogonUserID"]');
    await page.waitFor(1000);

    await page.type('input[name="FakeLogonUserID"]', "8195475386");

    await page.waitFor('input[name="FakeLogonPassword"]');
    await page.type('input[name="FakeLogonPassword"]', "xUKSWPgHy2H2XBt8cv");

    const returnToTPPElement = await page.$x("//button[contains(., 'Continue')]");
    await Promise.all([returnToTPPElement[0].click(), page.waitForNavigation()]);

     await page.waitForSelector(".Accounts__list input[type='checkbox']");
    await page.waitFor(1000);

    await page.evaluate(() => {
      document.querySelectorAll(".Accounts__list input[type='checkbox']").forEach((c) => c.click());
    });

    await page.click(".Selection__buttons #confirm:not([disabled])");

    await page.waitFor(1000);
    await page.waitForSelector(".esafeIDSignature #ASHESignatureConfirmButton:not([disabled])");
    await page.click(".esafeIDSignature #ASHESignatureConfirmButton:not([disabled])");

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
  doDanskeSandboxLogin,
};
