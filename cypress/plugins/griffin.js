const puppeteer = require('./puppeteer');

async function doGriffinSandboxLogin(url, options) {
  const { browser, page } = await puppeteer.newPage(options);

  try {
    await page.goto(url);
    // await page.waitForNavigation();

    await page.waitForSelector('form#login button[type="submit"]', { timeout: 10000 });
    await Promise.all([page.click('form#login button[type="submit"]'), page.waitForNavigation()]);

    await page.waitForSelector('form#login button[type="submit"]', { timeout: 10000 });
    await Promise.all([page.click('form#login button[type="submit"]'), page.waitForNavigation()]);

    const firstRequest = await page.waitForRequest((request) => {
      return request.url().includes('https://cypress.bankio.local/openbanking/callback') && request.method() === 'GET';
    });

    await browser.close();

    return firstRequest.url();
  } catch (e) {
    console.error(e);

    await page.screenshot({
      path: './cypress/screenshots/griffin.jpg',
      type: 'jpeg',
      fullPage: true,
    });
  } finally {
    await browser.close();
  }
}

module.exports = {
  doGriffinSandboxLogin,
};
