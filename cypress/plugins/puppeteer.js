const puppeteer = require("puppeteer");

async function launch(options) {
    const browser = await puppeteer.launch({ headless: false, args: ["--disable-web-security", ...(options && options.headless ? ["--no-sandbox"] : [])], ...options });
    return browser;
}

module.exports = {
    launch
}