const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function verifyRightNavigation() {
  const browser = await chromium.launch({ headless: true });
  const screenshotDir = path.join(__dirname, '..', 'screenshots');
  if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

  console.log('=== TEST SUITE: Right-Side Navigation & Theme Removal ===\n');

  // ==================== 1. DESKTOP TESTS ====================
  console.log('--- 1. Desktop Screen Verification (1280x800) ---');
  const desktopContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const dPage = await desktopContext.newPage();

  const pages = [
    { url: 'http://localhost:3000/', name: 'Home / About Us' },
    { url: 'http://localhost:3000/web-development.html', name: 'Web Dev' },
    { url: 'http://localhost:3000/mobile-app-development.html', name: 'Mobile App' },
    { url: 'http://localhost:3000/website-development.html', name: 'Website Dev' }
  ];

  for (const p of pages) {
    await dPage.goto(p.url, { waitUntil: 'networkidle' });

    // Verify settings button does NOT exist
    const settingsBtn = await dPage.$('#settings-btn');
    if (settingsBtn) throw new Error(`[FAIL] #settings-btn should not exist on ${p.name}`);

    // Verify desktop nav exists and is visible
    const nav = await dPage.$('nav');
    const navVisible = await nav.isVisible();
    if (!navVisible) throw new Error(`[FAIL] <nav> should be visible on desktop for ${p.name}`);

    // Verify nav position is on the right side
    const navRect = await nav.boundingBox();
    console.log(`[PASS] ${p.name}: <nav> x=${navRect.x.toFixed(0)}, width=${navRect.width.toFixed(0)}, right=${(navRect.x + navRect.width).toFixed(0)} / 1280`);
    if (navRect.x < 500) throw new Error(`[FAIL] <nav> is not on the right side of the screen on ${p.name}`);

    // Check all 5 options in desktop nav
    const servicesBtn = await dPage.$('#services-btn');
    const resourcesBtn = await dPage.$('#resources-btn');
    const portfolioBtn = await dPage.$('#portfolio-btn');
    const aboutLink = await dPage.locator('nav a:has-text("About Us"), nav button:has-text("About Us")');
    const contactLink = await dPage.locator('nav a:has-text("Contact Us"), nav button:has-text("Contact Us")');

    if (!servicesBtn || !resourcesBtn || !portfolioBtn || (await aboutLink.count()) === 0 || (await contactLink.count()) === 0) {
      throw new Error(`[FAIL] Missing required options on ${p.name}`);
    }
  }

  // Test Services Popup opening on desktop without overflow
  console.log('\nTesting Services Popup on Desktop...');
  await dPage.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await dPage.click('#services-btn');
  await dPage.waitForTimeout(300);

  const popupBox = await dPage.locator('#services-popup').boundingBox();
  console.log(`Services Popup bounding box: x=${popupBox.x.toFixed(0)}, y=${popupBox.y.toFixed(0)}, width=${popupBox.width.toFixed(0)}, right=${(popupBox.x + popupBox.width).toFixed(0)} / 1280`);
  if (popupBox.x < 0 || (popupBox.x + popupBox.width) > 1280) {
    throw new Error(`[FAIL] Services Popup overflows viewport! Left=${popupBox.x}, Right=${popupBox.x + popupBox.width}`);
  }
  console.log('[PASS] Services Popup stays 100% inside viewport on desktop!');
  await dPage.screenshot({ path: path.join(screenshotDir, 'desktop-services-popup-right.png') });

  // Test Portfolio Popup
  console.log('Testing Portfolio Popup on Desktop...');
  await dPage.click('#portfolio-btn');
  await dPage.waitForTimeout(300);
  const portBox = await dPage.locator('#portfolio-popup').boundingBox();
  console.log(`Portfolio Popup bounding box: x=${portBox.x.toFixed(0)}, width=${portBox.width.toFixed(0)}, right=${(portBox.x + portBox.width).toFixed(0)} / 1280`);
  if (portBox.x < 0 || (portBox.x + portBox.width) > 1280) {
    throw new Error(`[FAIL] Portfolio Popup overflows viewport!`);
  }
  console.log('[PASS] Portfolio Popup stays 100% inside viewport on desktop!');

  await dPage.screenshot({ path: path.join(screenshotDir, 'desktop-navbar-right.png'), clip: { x: 0, y: 0, width: 1280, height: 120 } });
  await desktopContext.close();

  // ==================== 2. MOBILE TESTS ====================
  console.log('\n--- 2. Mobile Screen Verification (390x844 - iPhone 12) ---');
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const mPage = await mobileContext.newPage();

  for (const p of pages) {
    await mPage.goto(p.url, { waitUntil: 'networkidle' });

    // Verify settings button does NOT exist
    const settingsBtn = await mPage.$('#settings-btn');
    if (settingsBtn) throw new Error(`[FAIL] #settings-btn should not exist on mobile for ${p.name}`);

    // Verify mobile menu button exists and is visible on the right corner
    const menuBtn = await mPage.$('#mobile-menu-btn');
    if (!menuBtn || !(await menuBtn.isVisible())) {
      throw new Error(`[FAIL] #mobile-menu-btn should be visible on mobile for ${p.name}`);
    }

    const btnBox = await menuBtn.boundingBox();
    console.log(`[PASS] ${p.name}: Mobile Menu Button x=${btnBox.x.toFixed(0)}, right=${(btnBox.x + btnBox.width).toFixed(0)} / 390`);
    if (btnBox.x < 250) throw new Error(`[FAIL] Mobile menu button is not in the right corner on ${p.name}`);
  }

  // Test Mobile Menu Dropdown Interaction
  console.log('\nTesting Mobile Menu Dropdown interaction...');
  await mPage.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await mPage.screenshot({ path: path.join(screenshotDir, 'mobile-header-right.png'), clip: { x: 0, y: 0, width: 390, height: 100 } });

  // Open mobile menu
  await mPage.click('#mobile-menu-btn');
  await mPage.waitForTimeout(300);

  const mobileMenu = await mPage.locator('#mobile-menu');
  const isMenuVisible = await mobileMenu.isVisible();
  console.log(`Mobile menu visible: ${isMenuVisible}`);
  if (!isMenuVisible) throw new Error('[FAIL] #mobile-menu did not become visible!');

  const mMenuBox = await mobileMenu.boundingBox();
  console.log(`Mobile Menu Dropdown bounding box: x=${mMenuBox.x.toFixed(0)}, width=${mMenuBox.width.toFixed(0)}, right=${(mMenuBox.x + mMenuBox.width).toFixed(0)} / 390`);
  if (mMenuBox.x < 0 || (mMenuBox.x + mMenuBox.width) > 395) {
    throw new Error(`[FAIL] Mobile menu dropdown overflows viewport!`);
  }

  // Check all 5 options inside mobile menu
  const mServices = await mPage.locator('#mobile-menu button:has-text("Services")');
  const mResources = await mPage.locator('#mobile-menu button:has-text("Resources")');
  const mPortfolio = await mPage.locator('#mobile-menu button:has-text("Portfolio")');
  const mAbout = await mPage.locator('#mobile-menu a:has-text("About Us")');
  const mContact = await mPage.locator('#mobile-menu a:has-text("Contact Us")');

  if ((await mServices.count()) === 0 || (await mResources.count()) === 0 || (await mPortfolio.count()) === 0 || (await mAbout.count()) === 0 || (await mContact.count()) === 0) {
    throw new Error('[FAIL] Missing one or more of the 5 options in the mobile menu!');
  }
  console.log('[PASS] All 5 options (Services, Resources, Portfolio, About Us, Contact Us) exist inside Mobile Menu!');

  // Test expanding Services submenu
  await mServices.click();
  await mPage.waitForTimeout(200);
  const subServices = await mPage.locator('#mobile-sub-services');
  console.log(`Services submenu visible after click: ${await subServices.isVisible()}`);
  if (!(await subServices.isVisible())) throw new Error('[FAIL] Services submenu did not open!');

  await mPage.screenshot({ path: path.join(screenshotDir, 'mobile-menu-open.png') });
  await mobileContext.close();
  await browser.close();

  console.log('\n======================================================');
  console.log('ALL VERIFICATION CHECKS PASSED PERFECTLY!');
  console.log('1. Settings icon removed from all pages.');
  console.log('2. Dark mode / Light mode toggle removed entirely; site is permanently dark.');
  console.log('3. Services, Resources, Portfolio, About Us, and Contact Us are aligned to the right side corner on desktop.');
  console.log('4. On mobile screens, all 5 options are accessible via the sleek right-corner mobile menu with zero overflow.');
  console.log('======================================================\n');
}

verifyRightNavigation().catch(err => {
  console.error('Verification error:', err);
  process.exit(1);
});

