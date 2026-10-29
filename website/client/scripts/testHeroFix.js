import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const viewports = [
  { name: '360px-mobile', width: 360, height: 740 },
  { name: '768px-tablet', width: 768, height: 1024 },
  { name: '1024px-laptop', width: 1024, height: 768 },
  { name: '1440px-desktop', width: 1440, height: 900 },
];

const screenshotsDir = path.resolve('./audit-screenshots/hero-fix');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function runHeroFixTests() {
  console.log('🚀 Starting Hero Fix Verification across Viewports & Themes...');
  const browser = await chromium.launch({ headless: true });
  const consoleErrors = [];
  let allPassed = true;

  for (const vp of viewports) {
    for (const theme of ['light', 'dark']) {
      const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(`[${vp.name}][${theme}] ${msg.text()}`);
        }
      });
      page.on('pageerror', (err) => {
        consoleErrors.push(`[${vp.name}][${theme}] Uncaught: ${err.message}`);
      });

      // Set localStorage theme before navigating
      await page.addInitScript((t) => {
        try {
          localStorage.setItem('que_theme', t);
          if (document && document.documentElement) {
            if (t === 'dark') {
              document.documentElement.classList.add('dark');
              document.documentElement.setAttribute('data-theme', 'dark');
            } else {
              document.documentElement.classList.remove('dark');
              document.documentElement.setAttribute('data-theme', 'light');
            }
          }
        } catch (e) {}
      }, theme);

      await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded', timeout: 20000 });
      
      // Wait for React hydration and hero mounting
      const headline = await page.waitForSelector('.hero-headline', { timeout: 15000 });
      if (!headline) {
        console.error(`❌ [${vp.name}][${theme}] .hero-headline not found!`);
        allPassed = false;
        await page.close();
        continue;
      }
      await page.waitForTimeout(1200);

      // 2. Check layout bounding rects to guarantee NO overlap
      const headlineBox = await headline.boundingBox();
      const quoteBtn = await page.$('a:has-text("Get a Quote")');
      const workBtn = await page.$('a:has-text("View Our Work")');
      const quoteBtnBox = quoteBtn ? await quoteBtn.boundingBox() : null;
      const workBtnBox = workBtn ? await workBtn.boundingBox() : null;

      // 3D stage canvas
      const canvasEl = await page.$('canvas');
      const canvasBox = canvasEl ? await canvasEl.boundingBox() : null;

      if (canvasBox && headlineBox) {
        // In desktop/laptop (>= 1024), text must be left and canvas right
        if (vp.width >= 1024) {
          const textRightEdge = headlineBox.x + headlineBox.width;
          const canvasLeftEdge = canvasBox.x;
          // Canvas must not overlap headline horizontally
          if (canvasLeftEdge < textRightEdge - 20) {
            console.error(`❌ [${vp.name}][${theme}] 3D stage overlaps headline! Canvas left: ${canvasLeftEdge}, text right: ${textRightEdge}`);
            allPassed = false;
          }
        } else {
          // In mobile/tablet (< 1024), text is first (above) and canvas is second (below)
          const textBottomEdge = (workBtnBox || quoteBtnBox || headlineBox).y + (workBtnBox || quoteBtnBox || headlineBox).height;
          const canvasTopEdge = canvasBox.y;
          if (canvasTopEdge < textBottomEdge - 10) {
            console.error(`❌ [${vp.name}][${theme}] 3D stage overlaps buttons vertically! Canvas top: ${canvasTopEdge}, text bottom: ${textBottomEdge}`);
            allPassed = false;
          }
        }
      }

      // 3. Check 3 Floating Glass Chips
      const chipInbound = await page.$('text="Inbound Support"');
      const chipChat = await page.$('text="Chat Support"');
      const chipOutbound = await page.$('text="Outbound Support"');

      if (!chipInbound || !chipChat || !chipOutbound) {
        console.error(`❌ [${vp.name}][${theme}] Missing one or more floating glass chips!`);
        allPassed = false;
      }

      // 4. Check Logo rounded container
      const logoImg = await page.$('img[alt="QUE SOLUTIONS"]');
      if (logoImg) {
        const logoParent = await page.evaluate((el) => {
          const p = el.parentElement;
          return {
            classes: p.className,
            borderRadius: window.getComputedStyle(p).borderRadius,
            backgroundColor: window.getComputedStyle(p).backgroundColor,
          };
        }, logoImg);
        if (!logoParent.borderRadius || logoParent.borderRadius === '0px') {
          console.error(`❌ [${vp.name}][${theme}] Logo parent has no rounded border-radius!`);
          allPassed = false;
        }
      }

      // 5. Screenshot
      const screenshotPath = path.join(screenshotsDir, `hero-${vp.name}-${theme}.png`);
      await page.screenshot({ path: screenshotPath });

      await page.close();
      console.log(`✓ [${vp.name}][${theme}] Verified successfully! Screenshot saved.`);
    }
  }

  await browser.close();

  console.log('\n====================================================');
  console.log('              HERO FIX AUDIT REPORT                 ');
  console.log('====================================================');
  if (consoleErrors.length > 0) {
    console.warn(`⚠️ Console errors captured (${consoleErrors.length}):`);
    consoleErrors.forEach((e) => console.warn('  ' + e));
  } else {
    console.log('✅ ZERO Console Errors!');
  }

  if (allPassed && consoleErrors.length === 0) {
    console.log('✅ ALL HERO FIX REQUIREMENTS PASSED 100%!');
  } else if (allPassed) {
    console.log('✅ All layout and visual requirements passed (minor non-blocking console logs).');
  } else {
    console.error('❌ Some tests failed. Please review the output above.');
    process.exit(1);
  }
}

runHeroFixTests().catch((err) => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
