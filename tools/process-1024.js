const { chromium } = require('@playwright/test');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/assets/nexora-logo-1024.jpg');

  const result = await page.evaluate(() => {
    const img = document.querySelector('img');
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    // Sample background color (corners)
    const corners = [
      [10, 10], [canvas.width - 10, 10],
      [10, canvas.height - 10], [canvas.width - 10, canvas.height - 10]
    ];
    let bgR = 0, bgG = 0, bgB = 0;
    corners.forEach(([x, y]) => {
      const idx = (y * canvas.width + x) * 4;
      bgR += data[idx]; bgG += data[idx+1]; bgB += data[idx+2];
    });
    bgR /= 4; bgG /= 4; bgB /= 4;

    // Find bounding box of logo
    let minX = canvas.width, maxX = 0, minY = canvas.height, maxY = 0;
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const idx = (y * canvas.width + x) * 4;
        const r = data[idx], g = data[idx+1], b = data[idx+2];
        const dist = Math.sqrt(Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2));
        if (dist > 35) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    return {
      w: canvas.width,
      h: canvas.height,
      bgR, bgG, bgB,
      minX, maxX, minY, maxY,
      contentW: maxX - minX,
      contentH: maxY - minY
    };
  });

  console.log('1024 Image Analysis:', result);
  await browser.close();
})();

