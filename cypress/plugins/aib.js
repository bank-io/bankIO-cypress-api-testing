
const puppeteer = require('./puppeteer');

async function doAIBSandboxLogin(url, options) {
  const { browser, page } = await puppeteer.newPage(options);
  
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
      path: "./cypress/screenshots/aib.jpg",
      type: "jpeg",
      fullPage: true
    });
  } finally {
    await browser.close();
  }
}

module.exports = {
    doAIBSandboxLogin
}