const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const pagesToTest = [
    { name: 'home', url: 'http://localhost:3000/' },
    { name: 'web-dev', url: 'http://localhost:3000/web-development.html' },
    { name: 'mobile-app', url: 'http://localhost:3000/mobile-app-development.html' },
    { name: 'website-dev', url: 'http://localhost:3000/website-development.html' },
    { name: 'brand-preview', url: 'http://localhost:3000/assets/brand-preview.html' }
  ];

  for (const item of pagesToTest) {
    await page.goto(item.url);
    await page.waitForTimeout(600);
    await page.screenshot({ path: `screenshots/page-${item.name}.png`, clip: { x: 0, y: 0, width: 1440, height: 500 } });
    console.log(`Saved screenshots/page-${item.name}.png`);
  }

  await browser.close();
})();

