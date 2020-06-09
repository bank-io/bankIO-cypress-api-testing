
const puppeteer = require('./puppeteer');

async function doNationwideSandboxLogin(url, options) {
  const page = await puppeteer.newPage(options);
  
  try {
    await page.goto(url);
    
    const firstRequest = await page.waitForRequest((request) => {
      return request.url().includes("https://cypress.bankio.local/openbanking/callback") && request.method() === "GET";
    });

    await browser.close();

    return firstRequest.url();
  } catch (e) {
    console.error(e);

    await page.screenshot({
      path: "./cypress/screenshots/nationwide.jpg",
      type: "jpeg",
      fullPage: true
    });
  } finally {
    await browser.close();
  }
}

module.exports = {
    doNationwideSandboxLogin
}