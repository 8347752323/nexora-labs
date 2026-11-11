const { chromium } = require('@playwright/test');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/assets/nexora-logo-raw.png');

  const result = await page.evaluate(() => {
    const img = document.querySelector('img');

    // 1. Create a 2x high-resolution canvas
    const scale = 3; // 3x supersampling for extreme sharpness
    const trimX = 32;
    const trimY = 35;
    const trimW = 276;
    const trimH = 106;

    // Step A: Extract original trimmed pixels
    const srcCanvas = document.createElement('canvas');
    srcCanvas.width = trimW;
    srcCanvas.height = trimH;
    const srcCtx = srcCanvas.getContext('2d');
    srcCtx.drawImage(img, trimX, trimY, trimW, trimH, 0, 0, trimW, trimH);

    const srcData = srcCtx.getImageData(0, 0, trimW, trimH);
    const sD = srcData.data;

    // Sample background color (top-left corner of raw image was ~ rgb(28, 22, 58))
    const bgR = 28, bgG = 22, bgB = 58;

    // Create transparent version with anti-aliasing
    for (let i = 0; i < sD.length; i += 4) {
      const r = sD[i], g = sD[i + 1], b = sD[i + 2];
      const dist = Math.sqrt(Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2));
      if (dist < 18) {
        sD[i + 3] = 0;
      } else if (dist < 38) {
        sD[i + 3] = Math.round(((dist - 18) / 20) * 255);
      } else {
        sD[i + 3] = 255;
      }
    }
    srcCtx.putImageData(srcData, 0, 0);

    // Step B: Render at 2x high-resolution with smoothing
    const highW = trimW * 2;
    const highH = trimH * 2;
    const hiCanvas = document.createElement('canvas');
    hiCanvas.width = highW;
    hiCanvas.height = highH;
    const hiCtx = hiCanvas.getContext('2d');
    hiCtx.imageSmoothingEnabled = true;
    hiCtx.imageSmoothingQuality = 'high';
    hiCtx.drawImage(srcCanvas, 0, 0, highW, highH);

    // Step C: Create light mode version (dark text)
    const lightCanvas = document.createElement('canvas');
    lightCanvas.width = highW;
    lightCanvas.height = highH;
    const lightCtx = lightCanvas.getContext('2d');
    lightCtx.drawImage(hiCanvas, 0, 0);

    const lightData = lightCtx.getImageData(0, 0, highW, highH);
    const lD = lightData.data;
    // The text 'Nexora' starts around X = 95 * 2 = 190
    for (let y = 0; y < highH; y++) {
      for (let x = 190; x < highW; x++) {
        const idx = (y * highW + x) * 4;
        const a = lD[idx + 3];
        if (a > 15) {
          lD[idx] = 15;     // #0f
          lD[idx + 1] = 23; // #17
          lD[idx + 2] = 42; // #2a
        }
      }
    }
    lightCtx.putImageData(lightData, 0, 0);

    // Step D: Extract high-res mark (first 96 * 2 = 192px width)
    const markW = 96 * 2;
    const markH = highH;
    const markCanvas = document.createElement('canvas');
    markCanvas.width = markW;
    markCanvas.height = markH;
    const markCtx = markCanvas.getContext('2d');
    markCtx.drawImage(hiCanvas, 0, 0, markW, markH, 0, 0, markW, markH);

    return {
      dark: hiCanvas.toDataURL('image/png'),
      light: lightCanvas.toDataURL('image/png'),
      mark: markCanvas.toDataURL('image/png')
    };
  });

  fs.writeFileSync('assets/nexora-logo.png', Buffer.from(result.dark.replace(/^data:image\/png;base64,/, ''), 'base64'));
  fs.writeFileSync('assets/nexora-logo-light.png', Buffer.from(result.light.replace(/^data:image\/png;base64,/, ''), 'base64'));
  fs.writeFileSync('assets/nexora-mark.png', Buffer.from(result.mark.replace(/^data:image\/png;base64,/, ''), 'base64'));

  console.log('Saved 2x crisp retina assets successfully!');
  await browser.close();
})();
