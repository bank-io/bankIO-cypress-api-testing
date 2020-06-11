
const puppeteer = require('./puppeteer');

async function doBankinterSandboxLogin(url, options) {
  const { browser, page } = await puppeteer.newPage(options);
  
  try {
    await page.goto(url);

    await page.waitFor("//mat-form-field[.//mat-label[contains(., 'Usuario')]]//input");
    await page.type("//mat-form-field[.//mat-label[contains(., 'Usuario')]]//input", "user1");

    await page.waitFor("//mat-form-field[.//mat-label[contains(., 'Contraseña')]]//input");
    await page.type("//mat-form-field[.//mat-label[contains(., 'Contraseña')]]//input", "1234");
    
    await page.waitForXPath("//button[contains(., 'Continuar')][not(@disabled)]");
    const returnToTPPElement = await page.$x("//button[contains(., 'Continuar')][not(@disabled)]");
    await returnToTPPElement[0].click();
    
    await page.waitForXPath("//button[contains(., 'Continuar')]");
    const confirmButtonElement = await page.$x("//button[contains(., 'Continuar')]");
    await confirmButtonElement[0].click();

    const firstRequest = await page.waitForRequest((request) => {
      return request.url().includes("https://cypress.bankio.local/openbanking/callback") && request.method() === "GET";
    });

    await browser.close();

    return firstRequest.url();
  } catch (e) {
    console.error(e);

    await page.screenshot({
      path: "./cypress/screenshots/bankinter.jpg",
      type: "jpeg",
      fullPage: true
    });
  } finally {
    await browser.close();
  }
}

module.exports = {
    doBankinterSandboxLogin
}