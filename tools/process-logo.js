const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

(async () => {
  try {
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

      // Extract colors & corners
      const corners = [
        [0, 0],
        [canvas.width - 1, 0],
        [0, canvas.height - 1],
        [canvas.width - 1, canvas.height - 1]
      ];
      let bgR = 0, bgG = 0, bgB = 0;
      corners.forEach(([x, y]) => {
        const idx = (y * canvas.width + x) * 4;
        bgR += data[idx];
        bgG += data[idx + 1];
        bgB += data[idx + 2];
      });
      bgR /= 4; bgG /= 4; bgB /= 4;

      // Create transparent full logo
      const tCanvas = document.createElement('canvas');
      tCanvas.width = canvas.width;
      tCanvas.height = canvas.height;
      const tCtx = tCanvas.getContext('2d');
      const tData = tCtx.createImageData(canvas.width, canvas.height);

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const dist = Math.sqrt(Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2));
        if (dist < 22) {
          tData.data[i] = 0;
          tData.data[i + 1] = 0;
          tData.data[i + 2] = 0;
          tData.data[i + 3] = 0;
        } else if (dist < 42) {
          const alpha = (dist - 22) / 20;
          tData.data[i] = r;
          tData.data[i + 1] = g;
          tData.data[i + 2] = b;
          tData.data[i + 3] = Math.round(alpha * 255);
        } else {
          tData.data[i] = r;
          tData.data[i + 1] = g;
          tData.data[i + 2] = b;
          tData.data[i + 3] = 255;
        }
      }
      tCtx.putImageData(tData, 0, 0);

      // Crop Mark only
      // Mark bounding box is roughly X: 32 to 122, Y: 46 to 142
      const markWidth = 92;
      const markHeight = 96;
      const mCanvas = document.createElement('canvas');
      mCanvas.width = markWidth;
      mCanvas.height = markHeight;
      const mCtx = mCanvas.getContext('2d');
      mCtx.drawImage(tCanvas, 32, 46, markWidth, markHeight, 0, 0, markWidth, markHeight);

      // Crop Full Logo with trimmed margins
      // X: 32 to 310, Y: 44 to 144
      const fullTrimW = 280;
      const fullTrimH = 100;
      const fCanvas = document.createElement('canvas');
      fCanvas.width = fullTrimW;
      fCanvas.height = fullTrimH;
      const fCtx = fCanvas.getContext('2d');
      fCtx.drawImage(tCanvas, 32, 44, fullTrimW, fullTrimH, 0, 0, fullTrimW, fullTrimH);

      return {
        fullTransparent: fCanvas.toDataURL('image/png'),
        markTransparent: mCanvas.toDataURL('image/png')
      };
    });

    const fullBuf = Buffer.from(result.fullTransparent.replace(/^data:image\/png;base64,/, ''), 'base64');
    const markBuf = Buffer.from(result.markTransparent.replace(/^data:image\/png;base64,/, ''), 'base64');

    fs.writeFileSync('assets/nexora-logo-transparent.png', fullBuf);
    fs.writeFileSync('assets/nexora-mark-transparent.png', markBuf);
    console.log('Saved transparent PNGs successfully!');

    await browser.close();
  } catch (e) {
    console.error('Error:', e);
  }
})();
