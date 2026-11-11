const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/assets/nexora-logo-1024.jpg');

  const analysis = await page.evaluate(() => {
    const img = document.querySelector('img');
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    // The text 'Nexora' has white pixels where r > 200, g > 200, b > 200!
    let textMinX = canvas.width, textMaxX = 0, textMinY = canvas.height, textMaxY = 0;
    // The mark has vibrant colored pixels
    let markMinX = canvas.width, markMaxX = 0, markMinY = canvas.height, markMaxY = 0;

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const idx = (y * canvas.width + x) * 4;
        const r = data[idx], g = data[idx+1], b = data[idx+2];

        // White text check
        if (r > 190 && g > 190 && b > 190) {
          if (x < textMinX) textMinX = x;
          if (x > textMaxX) textMaxX = x;
          if (y < textMinY) textMinY = y;
          if (y > textMaxY) textMaxY = y;
        }

        // Vibrant mark colors (cyan, magenta, blue): saturation check or r/g/b distinct
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        if (max > 120 && (max - min) > 50 && x < 500) {
          if (x < markMinX) markMinX = x;
          if (x > markMaxX) markMaxX = x;
          if (y < markMinY) markMinY = y;
          if (y > markMaxY) markMaxY = y;
        }
      }
    }

    return {
      text: { textMinX, textMaxX, textMinY, textMaxY, w: textMaxX - textMinX, h: textMaxY - textMinY },
      mark: { markMinX, markMaxX, markMinY, markMaxY, w: markMaxX - markMinX, h: markMaxY - markMinY }
    };
  });

  console.log('Detected Mark & Text:', analysis);
  await browser.close();
})();

