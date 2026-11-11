const { chromium } = require('@playwright/test');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/assets/nexora-logo-1024.jpg');

  const assets = await page.evaluate(() => {
    const img = document.querySelector('img');
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    // The logo content is centered around:
    // X from 188 to 836 (width 648)
    // Y from 404 to 620 (height 216)
    const padding = 10;
    const minX = 188 - padding;
    const maxX = 836 + padding;
    const minY = 404 - padding;
    const maxY = 620 + padding;
    const cropW = maxX - minX;
    const cropH = maxY - minY;

    // Sample dark background color in the vicinity of the logo
    // e.g. at (100, 500)
    const bgIdx = (500 * canvas.width + 100) * 4;
    const bgR = data[bgIdx];
    const bgG = data[bgIdx + 1];
    const bgB = data[bgIdx + 2];

    // 1. Transparent Full Logo Canvas
    const logoCanvas = document.createElement('canvas');
    logoCanvas.width = cropW;
    logoCanvas.height = cropH;
    const logoCtx = logoCanvas.getContext('2d');
    const logoData = logoCtx.createImageData(cropW, cropH);

    for (let y = 0; y < cropH; y++) {
      for (let x = 0; x < cropW; x++) {
        const srcX = x + minX;
        const srcY = y + minY;
        const srcIdx = (srcY * canvas.width + srcX) * 4;
        const dstIdx = (y * cropW + x) * 4;

        const r = data[srcIdx];
        const g = data[srcIdx + 1];
        const b = data[srcIdx + 2];

        // Euclidean color distance from background
        const dist = Math.sqrt(Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2));

        if (dist < 20) {
          logoData.data[dstIdx] = 0;
          logoData.data[dstIdx + 1] = 0;
          logoData.data[dstIdx + 2] = 0;
          logoData.data[dstIdx + 3] = 0;
        } else if (dist < 45) {
          const alpha = (dist - 20) / 25;
          logoData.data[dstIdx] = r;
          logoData.data[dstIdx + 1] = g;
          logoData.data[dstIdx + 2] = b;
          logoData.data[dstIdx + 3] = Math.round(alpha * 255);
        } else {
          logoData.data[dstIdx] = r;
          logoData.data[dstIdx + 1] = g;
          logoData.data[dstIdx + 2] = b;
          logoData.data[dstIdx + 3] = 255;
        }
      }
    }
    logoCtx.putImageData(logoData, 0, 0);

    // 2. Light Mode Version (convert white text to #0f172a)
    const lightCanvas = document.createElement('canvas');
    lightCanvas.width = cropW;
    lightCanvas.height = cropH;
    const lightCtx = lightCanvas.getContext('2d');
    lightCtx.drawImage(logoCanvas, 0, 0);

    const lightData = lightCtx.getImageData(0, 0, cropW, cropH);
    const lD = lightData.data;
    // In crop space, text starts around x = 415 - minX = ~217
    const textStartInCrop = 415 - minX;

    for (let y = 0; y < cropH; y++) {
      for (let x = textStartInCrop; x < cropW; x++) {
        const idx = (y * cropW + x) * 4;
        const a = lD[idx + 3];
        if (a > 15) {
          lD[idx] = 15;     // #0f
          lD[idx + 1] = 23; // #17
          lD[idx + 2] = 42; // #2a
        }
      }
    }
    lightCtx.putImageData(lightData, 0, 0);

    // 3. Mark Only Canvas
    // In crop space: mark is from x = 190 - minX to x = 398 - minX, y = 405 - minY to y = 618 - minY
    const mStartX = Math.max(0, 190 - minX);
    const mStartY = Math.max(0, 405 - minY);
    const mW = 214;
    const mH = 218;

    const markCanvas = document.createElement('canvas');
    markCanvas.width = mW;
    markCanvas.height = mH;
    const markCtx = markCanvas.getContext('2d');
    markCtx.drawImage(logoCanvas, mStartX, mStartY, mW, mH, 0, 0, mW, mH);

    return {
      darkLogo: logoCanvas.toDataURL('image/png'),
      lightLogo: lightCanvas.toDataURL('image/png'),
      mark: markCanvas.toDataURL('image/png'),
      dims: { cropW, cropH, mW, mH }
    };
  });

  fs.writeFileSync('assets/nexora-logo.png', Buffer.from(assets.darkLogo.replace(/^data:image\/png;base64,/, ''), 'base64'));
  fs.writeFileSync('assets/nexora-logo-light.png', Buffer.from(assets.lightLogo.replace(/^data:image\/png;base64,/, ''), 'base64'));
  fs.writeFileSync('assets/nexora-mark.png', Buffer.from(assets.mark.replace(/^data:image\/png;base64,/, ''), 'base64'));

  console.log('Saved high-resolution assets:', assets.dims);
  await browser.close();
})();

