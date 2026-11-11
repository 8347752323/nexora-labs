const { chromium } = require('@playwright/test');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 800, height: 400 } });

  // Let's create an enhanced transparency extractor with anti-aliasing preservation:
  await page.goto('http://localhost:3000/assets/nexora-logo-raw.png');
  const bufferBase64 = await page.evaluate(() => {
    const img = document.querySelector('img');
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    // Background color is approximately rgb(28, 22, 58) in top-left
    // Let's compute average background color across outer borders
    let bgR = 0, bgG = 0, bgB = 0, bgCount = 0;
    for (let x = 0; x < canvas.width; x++) {
      for (let y = 0; y < 15; y++) {
        const idx = (y * canvas.width + x) * 4;
        bgR += data[idx]; bgG += data[idx+1]; bgB += data[idx+2];
        bgCount++;
      }
      for (let y = canvas.height - 15; y < canvas.height; y++) {
        const idx = (y * canvas.width + x) * 4;
        bgR += data[idx]; bgG += data[idx+1]; bgB += data[idx+2];
        bgCount++;
      }
    }
    bgR /= bgCount; bgG /= bgCount; bgB /= bgCount;

    // Bounding box of content: X: 33 to 306, Y: 37 to 139
    const trimX = 32;
    const trimY = 36;
    const trimW = 276;
    const trimH = 106;

    const outCanvas = document.createElement('canvas');
    outCanvas.width = trimW;
    outCanvas.height = trimH;
    const outCtx = outCanvas.getContext('2d');
    const outData = outCtx.createImageData(trimW, trimH);

    for (let y = 0; y < trimH; y++) {
      for (let x = 0; x < trimW; x++) {
        const srcIdx = ((y + trimY) * canvas.width + (x + trimX)) * 4;
        const outIdx = (y * trimW + x) * 4;

        const r = data[srcIdx];
        const g = data[srcIdx+1];
        const b = data[srcIdx+2];

        // Color distance from dark background
        const dist = Math.sqrt(Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2));

        if (dist < 16) {
          outData.data[outIdx] = 0;
          outData.data[outIdx+1] = 0;
          outData.data[outIdx+2] = 0;
          outData.data[outIdx+3] = 0;
        } else if (dist < 40) {
          // Smooth alpha transition
          const alpha = (dist - 16) / 24;
          outData.data[outIdx] = r;
          outData.data[outIdx+1] = g;
          outData.data[outIdx+2] = b;
          outData.data[outIdx+3] = Math.round(alpha * 255);
        } else {
          outData.data[outIdx] = r;
          outData.data[outIdx+1] = g;
          outData.data[outIdx+2] = b;
          outData.data[outIdx+3] = 255;
        }
      }
    }
    outCtx.putImageData(outData, 0, 0);

    // Also extract high-res mark
    return outCanvas.toDataURL('image/png');
  });

  const base64 = bufferBase64.replace(/^data:image\/png;base64,/, '');
  fs.writeFileSync('assets/nexora-logo.png', Buffer.from(base64, 'base64'));
  fs.writeFileSync('assets/nexora-logo-transparent.png', Buffer.from(base64, 'base64'));
  console.log('Saved high-fidelity assets/nexora-logo.png and assets/nexora-logo-transparent.png');

  await browser.close();
})();
