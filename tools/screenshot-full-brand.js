const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/assets/brand-preview.html');
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'screenshots/brand-preview-full.png', fullPage: true });
  console.log('Saved screenshots/brand-preview-full.png');
  await browser.close();
})();

