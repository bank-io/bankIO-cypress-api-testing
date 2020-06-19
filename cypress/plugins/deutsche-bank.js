const puppeteer = require("./puppeteer");

async function doDeutscheBankSandboxLogin(url, options) {
  const { browser, page } = await puppeteer.newPage(options);

  try {
    await page.setCacheEnabled(false);
    await page.goto(url);

    await page.waitForXPath("//a[contains(., 'SCA OK')]");

    const callbackPromise = new Promise((resolve, reject) => {
      browser.on("targetcreated", async (target) => {
        console.log(`Created target type ${target.type()} url ${target.url()}`);
        if (target.type() !== 'page') {
            return;
        } else {
            try {
              const newPage = await target.page();

              const firstRequest = await newPage.waitForRequest((request) => {
                return request.url().includes("https://cypress.bankio.local/openbanking/callback") && request.method() === "GET";
              });

              resolve(firstRequest.url())
            } catch (innerError) {
              reject(innerError);
            }
        }
      });
    });

    const scaOKElement = await page.$x("//a[contains(., 'SCA OK')]");
    await scaOKElement[0].click();

    const firstRequestUrl = await callbackPromise;

    await browser.close();

    return firstRequestUrl;
  } catch (e) {
    console.error(e);

    await page.screenshot({
      path: "./cypress/screenshots/deutsche-bank.jpg",
      type: "jpeg",
      fullPage: true,
    });
  } finally {
    // await browser.close();
  }
}

module.exports = {
  doDeutscheBankSandboxLogin,
};
