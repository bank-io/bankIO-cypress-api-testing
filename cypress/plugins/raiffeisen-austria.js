
const puppeteer = require('./puppeteer');

async function doRaiffeisenAustriaSandboxLogin(url, options) {
  const { browser, page } = await puppeteer.newPage(options);

  try {
    await page.goto(url);

    await page.waitForXPath("//button[contains(., 'Simulate confirmation with SCA')][not(@disabled)]");
    const returnToTPPElement = await page.$x("//button[contains(., 'Simulate confirmation with SCA')][not(@disabled)]");
    await returnToTPPElement[0].click();

    await page.waitFor("//p[contains(., 'After a successful SCA, the user will be redirected to ')]/strong");
    const urlLabelElement = await page.$x("//p[contains(., 'After a successful SCA, the user will be redirected to ')]/strong");
    const label = await page.evaluate(el => el.textContent, urlLabelElement[0]);
    // const label = await urlLabelElement[0].getProperty('innerText')

    console.log('label', label);

    await page.goto(label);

    const firstRequest = await page.waitForRequest((request) => {
      return request.url().includes("https://cypress.bankio.local/openbanking/callback") && request.method() === "GET";
    });

    await browser.close();

    return firstRequest.url();
  } catch (e) {
    console.error(e);

    await page.screenshot({
      path: "./cypress/screenshots/raiffeisen-austria.jpg",
      type: "jpeg",
      fullPage: true
    });
  } finally {
    await browser.close();
  }
}

module.exports = {
    doRaiffeisenAustriaSandboxLogin
}