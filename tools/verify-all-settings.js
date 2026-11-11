const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const pages = [
    { name: 'home', url: 'http://localhost:3000/' },
    { name: 'web-dev', url: 'http://localhost:3000/web-development.html' },
    { name: 'mobile-app', url: 'http://localhost:3000/mobile-app-development.html' },
    { name: 'website-dev', url: 'http://localhost:3000/website-development.html' }
  ];

  for (const item of pages) {
    await page.goto(item.url);
    await page.waitForTimeout(400);

    const btn = await page.$('#settings-btn');
    if (!btn) throw new Error(`Missing #settings-btn on ${item.name}`);
    await btn.click();
    await page.waitForTimeout(300);

    const popup = await page.$('#settings-popup');
    const isVisible = await popup.isVisible();
    const box = await popup.boundingBox();

    console.log(`[${item.name}] visible: ${isVisible}, box: ${box.width}x${box.height} at (${box.x}, ${box.y})`);

    // Verify small size (width < 320, height < 250)
    if (box.width > 320 || box.height > 250) {
      throw new Error(`[${item.name}] Settings popup is too large: ${box.width}x${box.height}`);
    }

    // Click outside to test close
    await page.click('body', { position: { x: 100, y: 100 } });
    await page.waitForTimeout(200);
    const closed = !(await popup.isVisible());
    console.log(`[${item.name}] closed on click outside: ${closed}`);

    if (!closed) throw new Error(`[${item.name}] Popup failed to close on click outside`);
  }

  await browser.close();
  console.log('ALL 4 PAGES PASSED SETTINGS POPUP TEST SUCCESSFULLY!');
})();

