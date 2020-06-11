
const puppeteer = require('./puppeteer');

async function doUnicajaSandboxLogin(url, options) {
  const { browser, page } = await puppeteer.newPage(options);
  
  try {
    await page.goto(url);

    await page.waitFor('input[name="usuario"]');
    await page.type('input[name="usuario"]', "user1");

    await page.waitFor('input[name="clave"]');
    await page.type('input[name="clave"]', "1234");

    await page.waitForSelector('input[type="submit"][value="Entrar"]:not([disabled])');
    await Promise.all([page.click('input[type="submit"][value="Entrar"]:not([disabled])'), page.waitForNavigation()]);
    
    await page.waitForXPath("//span[contains(., 'MARINA CABRERA MARTINEZ')]");
    const accountElement = await page.$x("//span[contains(., 'MARINA CABRERA MARTINEZ')]");
    await accountElement[0].click();
    
    await page.waitForXPath("//a[contains(., 'Continuar')][not(@disabled)]");
    const confirmButtonElement = await page.$x("//a[contains(., 'Continuar')][not(@disabled)]");
    await confirmButtonElement[0].click();

    await page.waitFor('input[name="claveSeguridad"]');
    await page.type('input[name="claveSeguridad"]', "123456");
    
    await page.waitForSelector('input[type="button"][value="Aceptar"]:not([disabled])');
    await page.click('input[type="button"][value="Aceptar"]:not([disabled])');

    const firstRequest = await page.waitForRequest((request) => {
      return request.url().includes("https://cypress.bankio.local/openbanking/callback") && request.method() === "GET";
    });

    await browser.close();

    return firstRequest.url();
  } catch (e) {
    console.error(e);

    await page.screenshot({
      path: "./cypress/screenshots/unicaja.jpg",
      type: "jpeg",
      fullPage: true
    });
  } finally {
    await browser.close();
  }
}

module.exports = {
    doUnicajaSandboxLogin
}