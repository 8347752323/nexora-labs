const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/assets/nexora-logo-raw.png');

  const tips = await page.evaluate(() => {
    const img = document.querySelector('img');
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    // Center of mark
    const cx = 71;
    const cy = 94;

    // Scan for outermost colored pixel in every direction
    const directions = [];
    for (let deg = 0; deg < 360; deg++) {
      const rad = (deg * Math.PI) / 180;
      let lastR = 0;
      let lastX = cx, lastY = cy;
      for (let r = 10; r < 60; r++) {
        const x = Math.round(cx + r * Math.cos(rad));
        const y = Math.round(cy + r * Math.sin(rad));
        const idx = (y * canvas.width + x) * 4;
        const red = data[idx], green = data[idx+1], blue = data[idx+2];
        // non-background check
        if (red > 45 || green > 45 || blue > 95) {
          lastR = r;
          lastX = x;
          lastY = y;
        }
      }
      directions.push({ deg, r: lastR, x: lastX, y: lastY });
    }

    // Find 5 peaks
    const peaks = [];
    for (let i = 0; i < 360; i++) {
      const prev = directions[(i - 1 + 360) % 360].r;
      const curr = directions[i].r;
      const next = directions[(i + 1) % 360].r;
      if (curr >= prev && curr >= next && curr > 35) {
        peaks.push(directions[i]);
      }
    }
    return { cx, cy, peaks };
  });

  console.log('Detected Peaks:', tips.peaks);
  await browser.close();
})();
