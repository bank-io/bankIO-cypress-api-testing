
const puppeteer = require('./puppeteer');

async function doRaiffeisenSlovakiaSandboxLogin(url, options) {
  const { browser, page } = await puppeteer.newPage(options);

  try {
    await page.goto(url);

    await page.waitForXPath("//button[contains(., 'USER:')][contains(., '910423')][not(@disabled)]");
    const userButtonElement = await page.$x("//button[contains(., 'USER:')][contains(., '910423')][not(@disabled)]");
    // await userButtonElement[0].click();

    await Promise.all([userButtonElement[0].click(), page.waitForNavigation()]);

    await page.waitFor("//button[contains(., 'Grant')][not(@disabled)]");
    const grantButtonElement = await page.$x("//button[contains(., 'Grant')][not(@disabled)]");
    await grantButtonElement[0].click();

    const firstRequest = await page.waitForRequest((request) => {
      return request.url().includes("https://cypress.bankio.local/openbanking/callback") && request.method() === "GET";
    });

    await browser.close();

    return firstRequest.url();
  } catch (e) {
    console.error(e);

    await page.screenshot({
      path: "./cypress/screenshots/raiffeisen-slovakia.jpg",
      type: "jpeg",
      fullPage: true
    });
  } finally {
    await browser.close();
  }
}

module.exports = {
    doRaiffeisenSlovakiaSandboxLogin
}