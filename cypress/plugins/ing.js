
const puppeteer = require('./puppeteer');

const shadowSelectorFn = (el, selector) => el.shadowRoot && el.shadowRoot.querySelector(selector);

const queryDeep = async (page, ...selectors) => {
    if (!selectors || selectors.length === 0) {
        return;
    }

    const [ firstSelector, ...restSelectors ] = selectors;
    let parentElement = await page.$(firstSelector);
    for (const selector of restSelectors) {
        parentElement = await page.evaluateHandle(shadowSelectorFn, parentElement, selector);
    }

    return parentElement;
};

async function doINGSandboxLogin(url, options) {
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();

  try {
    await page.goto(url);

    await page.waitFor('ing-app-myaccount-sandbox-ing-com');

    await page.waitFor(1000);

    await page.evaluate(() => { document.querySelector('ing-app-myaccount-sandbox-ing-com').shadowRoot.querySelector('iron-pages').querySelector('ing-app-myaccount-sandbox-ing-com-page-granting').shadowRoot.querySelector('ing-uic-card').querySelector('#selectedCountry').value = "RO"; });

    await page.waitFor(1000);
    await page.evaluate(() => { document.querySelector('ing-app-myaccount-sandbox-ing-com').shadowRoot.querySelector('iron-pages').querySelector('ing-app-myaccount-sandbox-ing-com-page-granting').shadowRoot.querySelector('#nextBtn').click(); });

    await page.waitFor(1000);
    await page.evaluate(() => { document.querySelector('ing-app-myaccount-sandbox-ing-com').shadowRoot.querySelector('iron-pages').querySelector('ing-app-myaccount-sandbox-ing-com-page-granting').shadowRoot.querySelector('paper-radio-button').click(); });

    await page.waitFor(1000);
    await page.evaluate(() => { document.querySelector('ing-app-myaccount-sandbox-ing-com').shadowRoot.querySelector('iron-pages').querySelector('ing-app-myaccount-sandbox-ing-com-page-granting').shadowRoot.querySelector('ing-uic-card').querySelector('#accountSelectionView').querySelector('#nextBtn').click(); });

    const firstRequest = await page.waitForRequest((request) => {
      return request.url().includes("https://cypress.bankio.local/openbanking/callback") && request.method() === "GET";
    });

    await browser.close();

    return firstRequest.url();
  } catch (e) {
    console.error(e);

    await page.screenshot({
      path: "./cypress/screenshots/ing.jpg",
      type: "jpeg",
      fullPage: true
    });
  } finally {
    await browser.close();
  }
}

module.exports = {
    doINGSandboxLogin
}