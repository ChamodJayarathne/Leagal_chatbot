const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:5173/map', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'map_screenshot_new.png', fullPage: true });
  await browser.close();
  console.log('Screenshot saved to map_screenshot_new.png');
})();
