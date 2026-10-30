import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const VIEWPORTS = [
  { name: '360px', width: 360, height: 740 },
  { name: '768px', width: 768, height: 1024 },
  { name: '1024px', width: 1024, height: 800 },
  { name: '1440px', width: 1440, height: 900 }
];

const THEMES = ['dark', 'light'];
const BASE_URL = 'http://localhost:4173';
const OUTPUT_DIR = './dist/logo-audit';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function run() {
  console.log('--- Starting Que Solutions 3D Logo Integration & Validation ---');
  const browser = await chromium.launch();
  let overallPass = true;

  for (const theme of THEMES) {
    for (const vp of VIEWPORTS) {
      const page = await browser.newPage({
        viewport: { width: vp.width, height: vp.height }
      });

      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });

      const url = `${BASE_URL}/?theme=${theme}`;
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000); // allow entrance animations to settle

      // Check horizontal overflow
      const hasHorizontalOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      // Find all logo instances
      const logoMetrics = await page.evaluate((currTheme) => {
        const logos = Array.from(document.querySelectorAll('img[alt="QUE SOLUTIONS"], img[alt="QUE"]'));
        return logos.map((img, idx) => {
          const rect = img.getBoundingClientRect();
          const naturalRatio = img.naturalWidth / img.naturalHeight;
          const renderedRatio = rect.width / rect.height;
          return {
            index: idx,
            src: img.src,
            width: rect.width,
            height: rect.height,
            visible: rect.width > 0 && rect.height > 0,
            naturalRatio: naturalRatio.toFixed(2),
            renderedRatio: renderedRatio.toFixed(2),
            aspectPreserved: Math.abs(naturalRatio - renderedRatio) < 0.15
          };
        });
      }, theme);

      const screenshotPath = path.join(OUTPUT_DIR, `logo_${theme}_${vp.name}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: false });

      console.log(`[${theme.toUpperCase()} - ${vp.name}]`);
      console.log(`  - Console errors: ${consoleErrors.length}`);
      console.log(`  - Horizontal overflow: ${hasHorizontalOverflow ? 'FAIL' : 'PASS'}`);
      console.log(`  - Logos detected: ${logoMetrics.length}`);
      logoMetrics.forEach(m => {
        console.log(`    * Logo #${m.index}: ${m.width}x${m.height}px, ratio preserved: ${m.aspectPreserved}, src: ${m.src.split('/').pop()}`);
      });

      if (consoleErrors.length > 0 || hasHorizontalOverflow || logoMetrics.length === 0) {
        overallPass = false;
      }

      await page.close();
    }
  }

  await browser.close();
  console.log('--- Logo Validation Complete. Overall Result:', overallPass ? 'ALL TESTS PASSED' : 'FAILED', '---');
  process.exit(overallPass ? 0 : 1);
}

run().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
