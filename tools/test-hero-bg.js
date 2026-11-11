const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(600);

  // Desktop dark mode hero
  await page.screenshot({ path: 'screenshots/hero-bg-desktop.png', clip: { x: 0, y: 0, width: 1440, height: 750 } });
  console.log('Saved screenshots/hero-bg-desktop.png');

  // Desktop light mode hero
  const settingsBtn = await page.$('#settings-btn');
  if (settingsBtn) {
    await settingsBtn.click();
    await page.waitForTimeout(300);
    const lightBtn = await page.$('#settings-popup button:has-text("Light")');
    if (lightBtn) await lightBtn.click();
    await page.waitForTimeout(400);
    await page.click('body', { position: { x: 100, y: 100 } });
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'screenshots/hero-bg-light.png', clip: { x: 0, y: 0, width: 1440, height: 750 } });
    console.log('Saved screenshots/hero-bg-light.png');
  }

  // Switch back to dark mode
  await settingsBtn.click();
  await page.waitForTimeout(300);
  const darkBtn = await page.$('#settings-popup button:has-text("Dark")');
  if (darkBtn) await darkBtn.click();
  await page.waitForTimeout(300);
  await page.click('body', { position: { x: 100, y: 100 } });

  // Mobile viewport
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshots/hero-bg-mobile.png', clip: { x: 0, y: 0, width: 375, height: 700 } });
  console.log('Saved screenshots/hero-bg-mobile.png');

  await browser.close();
})();

