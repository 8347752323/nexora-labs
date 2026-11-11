const { chromium } = require('@playwright/test');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/assets/nexora-logo-raw.png');

  // Let's render an HTML page comparing:
  // 1. The original raw image
  // 2. The cropped mark
  // 3. Various SVG recreations
  const html = `
    <!DOCTYPE html>
    <html>
    <head><style>body { background: #0b0e17; color: white; font-family: sans-serif; padding: 20px; }</style></head>
    <body>
      <h2>Original vs Cropped</h2>
      <img src="/assets/nexora-logo-raw.png" style="border: 1px solid #333">
      <img src="/assets/nexora-mark-transparent.png" style="border: 1px solid #333; background: #1a1a2e">
    </body>
    </html>
  `;
  fs.writeFileSync('assets/compare-logo.html', html);
  console.log('Created compare-logo.html');
  await browser.close();
})();
