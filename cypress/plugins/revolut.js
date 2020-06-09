
const puppeteer = require('./puppeteer');

async function doRevolutSandboxLogin(url, options) {
  const { browser, page } = await puppeteer.newPage(options);

  try {
    await page.goto(url);
    // await page.waitForNavigation()

    await page.waitFor('input[name="phone.number"]');
    await page.type('input[name="phone.number"]', "7216082217");

    const continueButtonElement = await page.$x("//button[contains(., 'Continue')]");
    await continueButtonElement[0].click();

    const zeroButtonElement = await page.$x("//button//span[contains(., '0')]");

    await zeroButtonElement[0].click();
    await page.waitFor(500);
    await zeroButtonElement[0].click();
    await page.waitFor(500);
    await zeroButtonElement[0].click();
    await page.waitFor(500);
    await zeroButtonElement[0].click();
    await page.waitFor(500);

    const returnToTPPElement = await page.$x("//button[contains(., 'Continue')]");
    await returnToTPPElement[0].click();


    await page.waitFor(500);
    await page.waitForXPath("//button[contains(., 'Authorise')][not(@disabled)]");
    const authoriseButtonElement = await page.$x("//button[contains(text(), 'Authorise')][not(@disabled)]");
    await authoriseButtonElement[0].click();

    // await page.evaluate(() => { Array.from(document.querySelectorAll('button')).find(el => el.textContent === 'Authorise').click(); });

    // var headings = document.evaluate("//button[contains(text(), 'Authorise')]", document, null, XPathResult.ANY_TYPE, null );

    const firstRequest = await page.waitForRequest((request) => {
      return request.url().includes("https://cypress.bankio.local/openbanking/callback") && request.method() === "GET";
    });

    await browser.close();

    return firstRequest.url();
  } catch (e) {
    console.error(e);

    await page.screenshot({
      path: "./cypress/screenshots/revolut.jpg",
      type: "jpeg",
      fullPage: true
    });
  } finally {
    await browser.close();
  }
}

module.exports = {
    doRevolutSandboxLogin
}