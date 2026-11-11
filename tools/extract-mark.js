const { chromium } = require('@playwright/test');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/assets/nexora-logo.png');

  const markBase64 = await page.evaluate(() => {
    const img = document.querySelector('img');
    const canvas = document.createElement('canvas');
    canvas.width = 96;
    canvas.height = 106;
    const ctx = canvas.getContext('2d');
    // Crop only the mark (first 96px width)
    ctx.drawImage(img, 0, 0, 96, 106, 0, 0, 96, 106);
    return canvas.toDataURL('image/png');
  });

  const base64 = markBase64.replace(/^data:image\/png;base64,/, '');
  fs.writeFileSync('assets/nexora-mark.png', Buffer.from(base64, 'base64'));
  console.log('Saved assets/nexora-mark.png');

  await browser.close();
})();
