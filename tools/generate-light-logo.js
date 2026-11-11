const { chromium } = require('@playwright/test');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/assets/nexora-logo.png');

  const lightDataUrl = await page.evaluate(() => {
    const img = document.querySelector('img');
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    // The text 'Nexora' starts around X = 95
    // In the text region, convert white/light pixels to dark slate #0f172a
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 95; x < canvas.width; x++) {
        const idx = (y * canvas.width + x) * 4;
        const a = data[idx + 3];
        if (a > 20) {
          // It's part of the text
          data[idx] = 15;     // R: #0f
          data[idx + 1] = 23; // G: #17
          data[idx + 2] = 42; // B: #2a
          // keep alpha
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);
    return canvas.toDataURL('image/png');
  });

  const base64 = lightDataUrl.replace(/^data:image\/png;base64,/, '');
  fs.writeFileSync('assets/nexora-logo-light.png', Buffer.from(base64, 'base64'));
  console.log('Saved assets/nexora-logo-light.png');

  await browser.close();
})();
