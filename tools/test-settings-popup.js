const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(600);

  // Click settings button
  const btn = await page.$('#settings-btn');
  console.log('Settings button found:', !!btn);
  await btn.click();
  await page.waitForTimeout(400);

  const popup = await page.$('#settings-popup');
  const isVisible = await popup.isVisible();
  console.log('Settings popup is visible:', isVisible);

  const box = await popup.boundingBox();
  console.log('Popup bounding box:', box);

  // Take screenshot of open popup
  await page.screenshot({ path: 'screenshots/settings-popup-open.png', clip: { x: 1050, y: 0, width: 380, height: 320 } });
  console.log('Saved screenshots/settings-popup-open.png');

  // Toggle light mode
  const lightBtn = await page.$('#settings-popup button:has-text("Light")');
  if (lightBtn) {
    await lightBtn.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'screenshots/settings-popup-light.png', clip: { x: 1050, y: 0, width: 380, height: 320 } });
    console.log('Saved screenshots/settings-popup-light.png');
  }

  // Toggle back to dark
  const darkBtn = await page.$('#settings-popup button:has-text("Dark")');
  if (darkBtn) {
    await darkBtn.click();
    await page.waitForTimeout(400);
  }

  // Click outside to test closing
  await page.click('body', { position: { x: 200, y: 200 } });
  await page.waitForTimeout(300);
  const isClosed = !(await popup.isVisible());
  console.log('Popup closed on click outside:', isClosed);

  await browser.close();
})();

