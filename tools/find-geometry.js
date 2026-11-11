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

    // Isolate the mark area: X in [30, 125], Y in [40, 145]
    // Find center of mass of non-bg pixels
    let sumX = 0, sumY = 0, count = 0;
    for (let y = 40; y < 145; y++) {
      for (let x = 30; x < 125; x++) {
        const idx = (y * canvas.width + x) * 4;
        const r = data[idx], g = data[idx+1], b = data[idx+2];
        if (r > 60 || g > 60 || b > 100) {
          sumX += x;
          sumY += y;
          count++;
        }
      }
    }
    const cx = sumX / count;
    const cy = sumY / count;

    // Scan radial distances in 360 degrees to find the 5 peaks
    const radii = [];
    for (let deg = 0; deg < 360; deg += 2) {
      const rad = (deg * Math.PI) / 180;
      let maxDist = 0;
      for (let r = 10; r < 60; r++) {
        const px = Math.round(cx + r * Math.cos(rad));
        const py = Math.round(cy + r * Math.sin(rad));
        const idx = (py * canvas.width + px) * 4;
        const red = data[idx], grn = data[idx+1], blu = data[idx+2];
        if (red > 60 || grn > 60 || blu > 100) {
          maxDist = r;
        }
      }
      radii.push({ deg, maxDist });
    }

    return { cx, cy, radii };
  });

  console.log('Center of mark:', tips.cx, tips.cy);
  // Find local peaks in radii
  const peaks = [];
  const r = tips.radii;
  for (let i = 0; i < r.length; i++) {
    const prev = r[(i - 1 + r.length) % r.length].maxDist;
    const curr = r[i].maxDist;
    const next = r[(i + 1) % r.length].maxDist;
    if (curr > prev && curr >= next && curr > 35) {
      peaks.push(r[i]);
    }
  }
  console.log('Outer Peaks (deg, dist):', peaks);

  await browser.close();
})();
