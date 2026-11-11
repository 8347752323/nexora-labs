const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(500);

  const header = await page.$('header');
  await header.screenshot({ path: 'screenshots/navbar-preview.png' });
  console.log('Saved screenshots/navbar-preview.png');

  await browser.close();
})();
