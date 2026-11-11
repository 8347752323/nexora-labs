const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 375, height: 667 } });
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(400);

  const btn = await page.$('#settings-btn');
  await btn.click();
  await page.waitForTimeout(300);

  const popup = await page.$('#settings-popup');
  const box = await popup.boundingBox();
  console.log(`[mobile 375px] popup box: ${box.width}x${box.height} at (${box.x}, ${box.y})`);

  // Verify it doesn't overflow the 375px screen
  if (box.x + box.width > 375) {
    console.error(`Popup overflows right edge! x+w = ${box.x + box.width}`);
  } else {
    console.log('Mobile fit: PERFECT (no overflow)');
  }

  await page.screenshot({ path: 'screenshots/mobile-settings-popup.png', clip: { x: 0, y: 0, width: 375, height: 350 } });
  console.log('Saved screenshots/mobile-settings-popup.png');

  await browser.close();
})();

