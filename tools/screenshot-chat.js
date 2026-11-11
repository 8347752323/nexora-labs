const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(500);

  // Click the floating chatbot button
  const trigger = await page.$('#nexora-chat-trigger');
  if (trigger) {
    await trigger.click({ force: true });
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'screenshots/chatbot-open.png', clip: { x: 950, y: 350, width: 480, height: 540 } });
    console.log('Saved screenshots/chatbot-open.png');
  }

  await browser.close();
})();

