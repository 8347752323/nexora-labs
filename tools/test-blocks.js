const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(600);

  // 1. Verify waitlist & stats are absent
  const hasWaitlist = await page.$('#waitlist, #email-input');
  console.log('Has waitlist form:', !!hasWaitlist);

  const bodyText = await page.innerText('body');
  const hasOldStats = bodyText.includes('9.8ms') || bodyText.includes('Synaptic Latency') || bodyText.includes('SOC2+');
  console.log('Has old stats:', hasOldStats);

  // 2. Verify 4 service blocks are present
  const hasWebDev = bodyText.includes('Web Development');
  const hasMobile = bodyText.includes('Mobile Apps');
  const hasChatbot = bodyText.includes('AI Chatbot Solutions');
  const hasQA = bodyText.includes('Quality Assurance');
  console.log('Blocks present:', { hasWebDev, hasMobile, hasChatbot, hasQA });

  // 3. Take desktop screenshot
  await page.screenshot({ path: 'screenshots/hero-service-blocks.png', clip: { x: 0, y: 0, width: 1440, height: 800 } });
  console.log('Saved screenshots/hero-service-blocks.png');

  // 4. Test clicking AI Chatbot Solutions block
  const chatbotBlock = await page.$('text=AI Chatbot Solutions');
  if (chatbotBlock) {
    await chatbotBlock.click();
    await page.waitForTimeout(400);
    const chatWindow = await page.$('#nexora-chat-window');
    const isChatOpen = await chatWindow.isVisible();
    console.log('Chatbot opened on clicking block:', isChatOpen);

    // Close chat
    const closeBtn = await page.$('#nexora-chat-close');
    if (closeBtn) await closeBtn.click();
    await page.waitForTimeout(300);
  }

  // 5. Test clicking Quality Assurance block
  const qaBlock = await page.$('text=Quality Assurance');
  if (qaBlock) {
    await qaBlock.click();
    await page.waitForTimeout(400);
    const modal = await page.$('#contact-modal');
    const isModalOpen = await modal.isVisible();
    console.log('Contact modal opened on clicking QA block:', isModalOpen);

    // Close modal
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  }

  // 6. Light Mode Screenshot
  const settingsBtn = await page.$('#settings-btn');
  if (settingsBtn) {
    await settingsBtn.click();
    await page.waitForTimeout(300);
    const lightBtn = await page.$('#settings-popup button:has-text("Light")');
    if (lightBtn) await lightBtn.click();
    await page.waitForTimeout(300);
    await page.click('body', { position: { x: 100, y: 100 } });
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'screenshots/hero-service-blocks-light.png', clip: { x: 0, y: 0, width: 1440, height: 800 } });
    console.log('Saved screenshots/hero-service-blocks-light.png');

    // Switch back to dark
    await settingsBtn.click();
    await page.waitForTimeout(300);
    const darkBtn = await page.$('#settings-popup button:has-text("Dark")');
    if (darkBtn) await darkBtn.click();
    await page.waitForTimeout(300);
    await page.click('body', { position: { x: 100, y: 100 } });
  }

  // 7. Mobile Viewport Screenshot
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshots/hero-service-blocks-mobile.png', clip: { x: 0, y: 0, width: 375, height: 800 } });
  console.log('Saved screenshots/hero-service-blocks-mobile.png');

  await browser.close();
})();

