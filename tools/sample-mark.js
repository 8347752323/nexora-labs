const { chromium } = require('@playwright/test');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/assets/nexora-logo-raw.png');

  const analysis = await page.evaluate(() => {
    const img = document.querySelector('img');
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    // Crop just the mark: X: 30 to 125, Y: 40 to 145
    // Let's print color samples along lines or detect connected components
    const samples = [];
    const points = [
      { name: 'center', x: 74, y: 92 },
      { name: 'tip_top', x: 69, y: 50 },
      { name: 'tip_right_top', x: 106, y: 64 },
      { name: 'tip_right_bot', x: 110, y: 115 },
      { name: 'tip_bot', x: 73, y: 137 },
      { name: 'tip_left', x: 35, y: 94 }
    ];

    points.forEach(p => {
      const idx = (p.y * canvas.width + p.x) * 4;
      samples.push({
        ...p,
        r: data[idx],
        g: data[idx+1],
        b: data[idx+2],
        hex: '#' + [data[idx], data[idx+1], data[idx+2]].map(x => x.toString(16).padStart(2, '0')).join('')
      });
    });

    return samples;
  });

  console.log('Sampled points in mark:', analysis);
  await browser.close();
})();
