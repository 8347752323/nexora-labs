const { chromium } = require('@playwright/test');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });

  // Let's create an HTML test page to overlay and align the SVG perfectly with the original PNG!
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet">
      <style>
        body { background: #15102a; color: white; font-family: sans-serif; padding: 40px; }
        .row { display: flex; gap: 40px; align-items: center; margin-bottom: 40px; }
        .box { background: rgba(255,255,255,0.05); padding: 20px; border-radius: 16px; }
      </style>
    </head>
    <body>
      <h2>Original Uploaded Logo</h2>
      <div class="box"><img src="/assets/nexora-logo-raw.png" width="356"></div>

      <h2>Transparent Cropped PNG</h2>
      <div class="box"><img src="/assets/nexora-logo-transparent.png" height="80"></div>

      <h2>SVG Vector Mark</h2>
      <div class="box"><img src="/assets/nexora-mark.svg" height="80"></div>
    </body>
    </html>
  `;
  fs.writeFileSync('assets/verify-logo.html', html);

  await page.goto('http://localhost:3000/assets/verify-logo.html');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshots/verify-logo.png' });
  console.log('Saved screenshots/verify-logo.png');

  await browser.close();
})();
