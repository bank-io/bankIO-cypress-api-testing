const puppeteer = require("puppeteer");

async function launch(options) {
    const browser = await puppeteer.launch({ headless: false, args: ["--disable-web-security", ...(options && options.headless ? ["--no-sandbox"] : [])], ...options });
    return browser;
}

async function newPage(options) {
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();

  await page.setDefaultNavigationTimeout(3 * 60 * 1000);
  await page.setDefaultTimeout(3 * 60 * 1000);

  return { browser, page };
}

module.exports = {
    launch,
    newPage
}