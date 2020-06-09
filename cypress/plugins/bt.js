
const puppeteer = require('./puppeteer');

async function doBTSandboxLogin(url, options) {
  const page = await puppeteer.newPage(options);

  try {
    await page.goto(url);

    await page.waitFor('[name="username"]');
    await page.type('[name="username"]', "user");

    await page.waitFor('[name="password"]');
    await page.type('[name="password"]', "Password123");

    await Promise.all([page.click(`input[type="submit"][value="NEXT"]`), page.waitForNavigation()]);

    await page.waitFor('[name="smsToken"]');
    await page.type('[name="smsToken"]', "123");

    await page.click(`#termcheck`);

    await Promise.all([page.click(`input[type="submit"][value="LOGIN"]`), page.waitForNavigation()]);

    const selectAllElement = await page.$x("//label[contains(., ' Select  all ')]");
    await selectAllElement[0].click();

    await page.click(`input[type="checkbox"][name="acceptTermsCond"]`);

    await Promise.all([page.click(`input[type="submit"][value="SUBMIT"]`), page.waitForNavigation()]);

    const firstRequest = await page.waitForRequest((request) => {
      return request.url().includes("https://cypress.bankio.local/openbanking/callback") && request.method() === "GET";
    });

    await browser.close();

    return firstRequest.url();
  } catch (e) {
    console.error(e);

    await page.screenshot({
      path: "./cypress/screenshots/bt.jpg",
      type: "jpeg",
      fullPage: true
    });
  } finally {
    await browser.close();
  }
}

module.exports = {
    doBTSandboxLogin
}