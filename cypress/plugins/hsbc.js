const puppeteer = require('./puppeteer');

async function doHSBCSandboxLogin(url, options) {
  const { browser, page } = await puppeteer.newPage(options);

  try {
    await page.goto(url);
    // await page.waitForNavigation();

    await page.waitForSelector('input[placeholder="Username"]', { timeout: 10000 });
    await page.type('input[placeholder="Username"]', 'uk.retail');

    await page.waitForSelector('.authentication-code-container .input-container input:nth-child(1)', { timeout: 10000 });

    await page.type('.authentication-code-container .input-container input:nth-child(1)', '1');

    await page.type('.authentication-code-container .input-container input:nth-child(2)', '2');

    await page.type('.authentication-code-container .input-container input:nth-child(3)', '3');

    await page.type('.authentication-code-container .input-container input:nth-child(4)', '4');

    await page.type('.authentication-code-container .input-container input:nth-child(5)', '5');

    await page.type('.authentication-code-container .input-container input:nth-child(6)', '6');

    const returnToTPPElement = await page.$x("//button[contains(., 'Continue')]");
    // await Promise.all([returnToTPPElement[0].click(), page.waitForNavigation()]);
    await returnToTPPElement[0].click();

    await page.waitForSelector('.accounts-box .account-box:nth-child(1)', { timeout: 10000 });
    await Promise.all([page.click('.accounts-box .account-box:nth-child(1)')]);

    const confirmButtonElement = await page.$x("//button[contains(., 'Confirm')]");
    // await Promise.all([confirmButtonElement[0].click(), page.waitForNavigation()]);
    await confirmButtonElement[0].click();

    const firstRequest = await page.waitForRequest((request) => {
      return request.url().includes('https://cypress.bankio.local/openbanking/callback') && request.method() === 'GET';
    });

    await browser.close();

    return firstRequest.url();
  } catch (e) {
    console.error(e);

    await page.screenshot({
      path: './cypress/screenshots/lloyds.jpg',
      type: 'jpeg',
      fullPage: true,
    });
  } finally {
    await browser.close();
  }
}

module.exports = {
  doHSBCSandboxLogin,
};
