const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/assets/nexora-logo-1024.jpg');

  const stats = await page.evaluate(() => {
    const img = document.querySelector('img');
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    // Check background at multiple points around text:
    const sampleBg = [
      [420, 420], [600, 420], [800, 420],
      [420, 600], [600, 600], [800, 600]
    ].map(([x, y]) => {
      const idx = (y * 1024 + x) * 4;
      return { x, y, r: data[idx], g: data[idx+1], b: data[idx+2] };
    });

    // Check pure white text interior:
    const sampleText = [
      [430, 510], // stem of N
      [525, 510], // e
      [640, 510], // o
    ].map(([x, y]) => {
      const idx = (y * 1024 + x) * 4;
      return { x, y, r: data[idx], g: data[idx+1], b: data[idx+2] };
    });

    return { sampleBg, sampleText };
  });

  console.log(JSON.stringify(stats, null, 2));
  await browser.close();
})();

