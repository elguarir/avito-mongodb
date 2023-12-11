const puppeteer = require('puppeteer');


async function run () {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: true});
    const page = await browser.newPage();
    await page.goto("https://google.com");
    await page.screenshot({path: 'screenshot.png'});
    browser.close();
}
run();