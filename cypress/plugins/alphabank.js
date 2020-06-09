
const puppeteer = require('./puppeteer');

async function typeInInputElement(page, inputSelector, text) {
  await page.evaluate((inputSelector, text) => {
    // Refer to https://stackoverflow.com/a/46012210/440432 for the below solution/code
    const inputElement = document.querySelector(inputSelector);
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeInputValueSetter.call(inputElement, text);

    const ev2 = new Event('input', {bubbles: true});
    inputElement.dispatchEvent(ev2);

  }, inputSelector, text);
}

async function doAlphaBankSandboxLogin(url, options) {
  const { browser, page } = await puppeteer.newPage(options);

  try {
    await page.goto(url);

    await page.waitFor('[name="UserName"]');
    await page.type('[name="UserName"]', "gpapadopoulos");

    await page.waitFor('[name="Password"]');
    await page.type('[name="Password"]', "GPapadopoulos01");

    await Promise.all([page.click(`button[name="submit.grant"]`), page.waitForNavigation()]);
    // await page.click(`button[name="submit.grant"]`),

    await page.waitFor('#checkotpbutton');
    await page.click(`#checkotpbutton`);

    await page.waitFor('#otpfield');

    await typeInInputElement(page, '#otpfield', '123456');

    // await Promise.all([page.click(`button[name="submit.grant"]`), page.waitForNavigation()]);
    // await page.click(`button[name="submit.grant"]:not([disabled])`);

    await page.waitFor(1000);
    await page.evaluate(() => { document.querySelector('button[name="submit.grant"]').click(); });

    // await page.click('#otpfield');
    // await page.keyboard.type('123456');

    // await page.focus('#otpfield');
    // await page.type('#otpfield', "123456");
    

    // await Promise.all([page.click(`input[type="submit"][value="LOGIN"]`), page.waitForNavigation()]);

    // const selectAllElement = await page.$x("//label[contains(., ' Select  all ')]");
    // await selectAllElement[0].click();

    // await page.click(`input[type="checkbox"][name="acceptTermsCond"]`);

    // await Promise.all([page.click(`input[type="submit"][value="SUBMIT"]`), page.waitForNavigation()]);

    const firstRequest = await page.waitForRequest((request) => {
      return request.url().includes("https://cypress.bankio.local/openbanking/callback") && request.method() === "GET";
    });

    await browser.close();

    return firstRequest.url();
  } catch (e) {
    console.error(e);

    await page.screenshot({
      path: "./cypress/screenshots/alphabank.jpg",
      type: "jpeg",
      fullPage: true
    });
  } finally {
    await browser.close();
  }
}

module.exports = {
    doAlphaBankSandboxLogin
}