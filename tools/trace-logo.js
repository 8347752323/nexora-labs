const { chromium } = require('@playwright/test');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/assets/nexora-logo-raw.png');

  const result = await page.evaluate(() => {
    const img = document.querySelector('img');
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    // Center of the star is approximately (74, 92)
    // Let's find the exact 5 petals
    // In each of the 5 sectors (each 72 degrees wide), let's inspect the shapes
    return {
      w: canvas.width,
      h: canvas.height
    };
  });

  await browser.close();
  console.log('Done');
})();
