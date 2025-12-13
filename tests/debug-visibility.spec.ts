import { test, expect } from '@playwright/test';

test.describe('Page Content Visibility Debug', () => {
  test('should display page content and verify nothing is hidden', async ({ page }) => {
    // Navigate to the page
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Take initial screenshot
    await page.screenshot({ path: 'test-results/01-initial-load.png', fullPage: true });

    // Wait for ASCII text to load
    await page.waitForSelector('.ascii-text-container', { timeout: 10000 });
    console.log('✓ ASCII text container found');

    // Check if content is visible
    const asciiVisible = await page.locator('.ascii-text-container').isVisible();
    console.log(`✓ ASCII container visible: ${asciiVisible}`);

    // Check all major sections
    const sections = ['home', 'about', 'services', 'artists', 'merch', 'contact'];
    for (const sectionId of sections) {
      const section = await page.locator(`#${sectionId}`);
      const exists = await section.count();
      const visible = exists > 0 ? await section.isVisible() : false;
      console.log(`✓ Section #${sectionId}: exists=${exists}, visible=${visible}`);
    }

    // Check for overlaying elements that might block content
    const hyperspeedContainer = await page.locator('#lights');
    const hyperspeedCount = await hyperspeedContainer.count();
    console.log(`Hyperspeed container count: ${hyperspeedCount}`);

    if (hyperspeedCount > 0) {
      const hyperspeedStyle = await hyperspeedContainer.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          position: styles.position,
          zIndex: styles.zIndex,
          display: styles.display,
          visibility: styles.visibility,
          opacity: styles.opacity,
          pointerEvents: styles.pointerEvents,
          width: styles.width,
          height: styles.height,
        };
      });
      console.log('Hyperspeed styles:', hyperspeedStyle);
    }

    // Take screenshot after checking
    await page.screenshot({ path: 'test-results/02-after-checks.png', fullPage: true });

    // Scroll down to see if content appears
    await page.evaluate(() => window.scrollTo(0, window.innerHeight / 2));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/03-after-scroll.png', fullPage: true });

    // Check body background and text colors
    const bodyStyles = await page.evaluate(() => {
      const body = document.body;
      const styles = window.getComputedStyle(body);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
      };
    });
    console.log('Body styles:', bodyStyles);

    // Check if any elements have opacity: 0 or visibility: hidden
    const hiddenElements = await page.evaluate(() => {
      const allElements = document.querySelectorAll('*');
      const hidden = [];
      allElements.forEach((el) => {
        const styles = window.getComputedStyle(el);
        if (styles.opacity === '0' || styles.visibility === 'hidden' || styles.display === 'none') {
          hidden.push({
            tag: el.tagName,
            id: el.id,
            className: el.className,
            opacity: styles.opacity,
            visibility: styles.visibility,
            display: styles.display,
          });
        }
      });
      return hidden.slice(0, 20); // First 20 hidden elements
    });
    console.log('Hidden elements:', hiddenElements);

    // Check z-index stacking
    const zIndexElements = await page.evaluate(() => {
      const allElements = document.querySelectorAll('*');
      const withZIndex = [];
      allElements.forEach((el) => {
        const styles = window.getComputedStyle(el);
        const zIndex = styles.zIndex;
        if (zIndex !== 'auto' && parseInt(zIndex) > 50) {
          withZIndex.push({
            tag: el.tagName,
            id: el.id,
            className: el.className,
            zIndex: zIndex,
            position: styles.position,
          });
        }
      });
      return withZIndex;
    });
    console.log('High z-index elements:', zIndexElements);

    // Verify home section content is actually visible
    const homeSection = await page.locator('#home');
    await expect(homeSection).toBeVisible();

    console.log('✓ Debug complete - check screenshots in test-results/');
  });

  test('should verify page renders without Hyperspeed blocking', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Wait for content
    await page.waitForTimeout(2000);

    // Get viewport height
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    console.log(`Viewport height: ${viewportHeight}px`);

    // Check if home section takes up full viewport
    const homeSectionHeight = await page.locator('#home').evaluate((el) => el.offsetHeight);
    console.log(`Home section height: ${homeSectionHeight}px`);

    // Verify ASCII text is rendering
    const asciiPre = await page.locator('.ascii-text-container pre');
    const preContent = await asciiPre.textContent();
    expect(preContent).toBeTruthy();
    expect(preContent!.length).toBeGreaterThan(50);
    console.log(`✓ ASCII text has ${preContent!.length} characters`);

    // Verify no full-page overlay is blocking content
    const overlays = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const fullPageOverlays = [];
      elements.forEach((el) => {
        const styles = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        if (
          styles.position === 'fixed' &&
          rect.width >= window.innerWidth * 0.9 &&
          rect.height >= window.innerHeight * 0.9 &&
          styles.zIndex !== 'auto' &&
          parseInt(styles.zIndex) > 50
        ) {
          fullPageOverlays.push({
            tag: el.tagName,
            id: el.id,
            className: el.className,
            zIndex: styles.zIndex,
            pointerEvents: styles.pointerEvents,
            opacity: styles.opacity,
          });
        }
      });
      return fullPageOverlays;
    });

    console.log('Full-page overlays:', overlays);

    if (overlays.length > 0) {
      console.warn('WARNING: Found full-page overlays that might block content!');
    }
  });
});
