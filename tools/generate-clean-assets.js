const { chromium } = require('@playwright/test');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/assets/nexora-logo-1024.jpg');

  const result = await page.evaluate(() => {
    const img = document.querySelector('img');
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const srcData = ctx.getImageData(0, 0, 1024, 1024).data;

    // Crop bounds:
    // Mark: x in [188, 395], y in [404, 616]
    // Text: x in [416, 836], y in [465, 558]
    // Overall bounding box with pleasant padding:
    const minX = 184;
    const maxX = 840;
    const minY = 398;
    const maxY = 622;
    const width = maxX - minX;
    const height = maxY - minY;

    // We'll create:
    // 1. Dark theme logo (White text, transparent bg)
    // 2. Light theme logo (Dark #0F172A text, transparent bg)
    // 3. Mark icon (224x224 square, transparent bg)

    const darkCanvas = document.createElement('canvas');
    darkCanvas.width = width;
    darkCanvas.height = height;
    const darkCtx = darkCanvas.getContext('2d');
    const darkImgData = darkCtx.createImageData(width, height);
    const dData = darkImgData.data;

    const lightCanvas = document.createElement('canvas');
    lightCanvas.width = width;
    lightCanvas.height = height;
    const lightCtx = lightCanvas.getContext('2d');
    const lightImgData = lightCtx.createImageData(width, height);
    const lData = lightImgData.data;

    // Helper: sample local background color based on X and Y
    // Background is a radial/vertical gradient from top-left to bottom-right
    function getBg(x, y) {
      // In this region:
      // at x=184: r~35, g~27, b~75
      // at x=840: r~22, g~22, b~51
      const t = (x - 184) / (840 - 184);
      return {
        r: 35 * (1 - t) + 21 * t,
        g: 27 * (1 - t) + 22 * t,
        b: 75 * (1 - t) + 50 * t
      };
    }

    const textSplitX = 412; // pixels with x >= textSplitX are text

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const globalX = x + minX;
        const globalY = y + minY;
        const srcIdx = (globalY * 1024 + globalX) * 4;
        const dstIdx = (y * width + x) * 4;

        const r = srcData[srcIdx];
        const g = srcData[srcIdx + 1];
        const b = srcData[srcIdx + 2];

        const bg = getBg(globalX, globalY);

        if (globalX >= textSplitX) {
          // --- TEXT REGION ---
          // Text is pure white (#FFFFFF) on dark background.
          // Luminance calculation:
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          const bgLum = 0.299 * bg.r + 0.587 * bg.g + 0.114 * bg.b;

          // Pure background threshold: bgLum is ~30-35. Add margin for JPEG noise:
          const thresholdLow = bgLum + 22; // ~55
          const thresholdHigh = 185;

          let alpha = 0;
          if (lum > thresholdLow) {
            if (lum >= thresholdHigh) {
              alpha = 1.0;
            } else {
              alpha = (lum - thresholdLow) / (thresholdHigh - thresholdLow);
              // smoothstep
              alpha = alpha * alpha * (3 - 2 * alpha);
            }
          }

          if (alpha > 0) {
            const a255 = Math.round(alpha * 255);
            // Dark logo: Pure crisp white text
            dData[dstIdx] = 255;
            dData[dstIdx + 1] = 255;
            dData[dstIdx + 2] = 255;
            dData[dstIdx + 3] = a255;

            // Light logo: Crisp slate #0F172A
            lData[dstIdx] = 15;
            lData[dstIdx + 1] = 23;
            lData[dstIdx + 2] = 42;
            lData[dstIdx + 3] = a255;
          } else {
            dData[dstIdx + 3] = 0;
            lData[dstIdx + 3] = 0;
          }

        } else {
          // --- MARK REGION ---
          // Color star icon: Cyan, Azure, Violet, Fuchsia
          // Distance from expected background:
          const diffR = r - bg.r;
          const diffG = g - bg.g;
          const diffB = b - bg.b;
          const colorDist = Math.sqrt(diffR * diffR + diffG * diffG + diffB * diffB);

          // Also check luminance and saturation
          const maxC = Math.max(r, g, b);
          const minC = Math.min(r, g, b);
          const sat = maxC > 0 ? (maxC - minC) / maxC : 0;

          // The star has vibrant colors (cyan, blue, magenta, purple).
          // Background noise is faint (dist < 18).
          const lowCut = 18;
          const highCut = 48;

          let alpha = 0;
          if (colorDist > lowCut) {
            if (colorDist >= highCut || sat > 0.35) {
              alpha = 1.0;
            } else {
              alpha = (colorDist - lowCut) / (highCut - lowCut);
            }
          }

          if (alpha > 0) {
            // Un-premultiply background to remove dark fringing:
            const a = Math.min(1.0, Math.max(0.1, alpha));
            let cleanR = Math.min(255, Math.max(0, Math.round((r - bg.r * (1 - a)) / a)));
            let cleanG = Math.min(255, Math.max(0, Math.round((g - bg.g * (1 - a)) / a)));
            let cleanB = Math.min(255, Math.max(0, Math.round((b - bg.b * (1 - a)) / a)));

            const a255 = Math.round(alpha * 255);

            dData[dstIdx] = cleanR;
            dData[dstIdx + 1] = cleanG;
            dData[dstIdx + 2] = cleanB;
            dData[dstIdx + 3] = a255;

            lData[dstIdx] = cleanR;
            lData[dstIdx + 1] = cleanG;
            lData[dstIdx + 2] = cleanB;
            lData[dstIdx + 3] = a255;
          } else {
            dData[dstIdx + 3] = 0;
            lData[dstIdx + 3] = 0;
          }
        }
      }
    }

    darkCtx.putImageData(darkImgData, 0, 0);
    lightCtx.putImageData(lightImgData, 0, 0);

    // 3. Mark icon (crop exactly the star)
    // Star is in [minX, textSplitX]
    const markCanvas = document.createElement('canvas');
    const markSize = 224;
    markCanvas.width = markSize;
    markCanvas.height = markSize;
    const markCtx = markCanvas.getContext('2d');

    // Star bounds inside darkCanvas:
    // X from 0 to (396 - minX) = 212
    // Y from (404 - minY) = 6 to (616 - minY) = 218
    const starSrcX = 188 - minX;
    const starSrcY = 402 - minY;
    const starSrcW = 398 - 188; // 210
    const starSrcH = 618 - 402; // 216

    const offsetX = Math.round((markSize - starSrcW) / 2);
    const offsetY = Math.round((markSize - starSrcH) / 2);
    markCtx.drawImage(darkCanvas, starSrcX, starSrcY, starSrcW, starSrcH, offsetX, offsetY, starSrcW, starSrcH);

    return {
      darkPng: darkCanvas.toDataURL('image/png'),
      lightPng: lightCanvas.toDataURL('image/png'),
      markPng: markCanvas.toDataURL('image/png'),
      width,
      height
    };
  });

  fs.writeFileSync('assets/nexora-logo.png', Buffer.from(result.darkPng.replace(/^data:image\/png;base64,/, ''), 'base64'));
  fs.writeFileSync('assets/nexora-logo-light.png', Buffer.from(result.lightPng.replace(/^data:image\/png;base64,/, ''), 'base64'));
  fs.writeFileSync('assets/nexora-mark.png', Buffer.from(result.markPng.replace(/^data:image\/png;base64,/, ''), 'base64'));

  console.log(`Generated perfectly cleaned assets: ${result.width}x${result.height}`);
  await browser.close();
})();

