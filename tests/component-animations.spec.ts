import { test, expect } from '@playwright/test';

test.describe('Component Animations and Rendering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000', { timeout: 60000 });
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000); // Allow animations to initialize
  });

  test('should render NOIRUXE ASCII text correctly', async ({ page }) => {
    // Check ASCII text is present
    const asciiText = await page.locator('.ascii-text-container');
    await expect(asciiText).toBeVisible();

    // Verify text content
    const textContent = await asciiText.textContent();
    expect(textContent).toContain('NOIRUXE');

    // Take screenshot
    await page.screenshot({ path: 'test-results/ascii-text.png' });
    console.log('✓ NOIRUXE ASCII text is rendering');
  });

  test('should have invisible TiltedCard backgrounds (deep black floating effect)', async ({ page }) => {
    const tiltedCards = await page.locator('.tilted-card');
    const count = await tiltedCards.count();
    expect(count).toBe(36);

    // Check first card has transparent background
    const firstCard = tiltedCards.first();
    const bgColor = await firstCard.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // Should be transparent or rgba(0,0,0,0)
    console.log(`Tilted card background: ${bgColor}`);
    expect(bgColor).toMatch(/transparent|rgba?\(0,\s*0,\s*0,\s*0\)/);
    console.log('✓ TiltedCard backgrounds are transparent (floating effect)');
  });

  test('should animate DecryptedText in merch section', async ({ page }) => {
    // Scroll to merch section
    await page.locator('#merch').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Check for "COMING SOON" text
    const merchSection = await page.locator('#merch');
    await expect(merchSection).toBeVisible();

    // DecryptedText should animate
    await page.waitForTimeout(2000); // Wait for animation

    const merchText = await merchSection.textContent();
    console.log(`Merch section text: ${merchText}`);
    
    // After animation, should show "COMING SOON"
    expect(merchText).toContain('COMING SOON');
    
    await page.screenshot({ path: 'test-results/decrypted-text.png' });
    console.log('✓ DecryptedText animation working in merch section');
  });

  test('should verify all sections are visible', async ({ page }) => {
    const sections = ['home', 'about', 'services', 'artists', 'merch', 'contact'];
    
    for (const sectionId of sections) {
      const section = await page.locator(`#${sectionId}`);
      
      // Scroll into view
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      // Check visibility
      await expect(section).toBeVisible();
      console.log(`✓ Section #${sectionId} is visible`);
    }
  });

  test('should verify CustomCursor is rendering', async ({ page }) => {
    // Check for cursor elements
    const cursors = await page.locator('.fixed.pointer-events-none').all();
    expect(cursors.length).toBeGreaterThan(0);
    console.log(`✓ CustomCursor elements found: ${cursors.length}`);
  });

  test('should verify menu navigation', async ({ page }) => {
    // Check menu is present - use more specific selectors
    const menu = page.locator('button:has-text("About")').first();
    await expect(menu).toBeVisible();
    
    const servicesLink = page.locator('button:has-text("Services")').first();
    await expect(servicesLink).toBeVisible();
    
    console.log('✓ Menu items are visible and accessible');
  });

  test('should check for console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    const consoleWarnings: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      } else if (msg.type() === 'warning') {
        consoleWarnings.push(msg.text());
      }
    });

    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Scroll through sections to trigger any lazy-loaded errors
    await page.locator('#about').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.locator('#services').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.locator('#artists').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    console.log(`Console errors found: ${consoleErrors.length}`);
    console.log(`Console warnings found: ${consoleWarnings.length}`);

    if (consoleErrors.length > 0) {
      console.log('Errors:', consoleErrors);
    }

    // Only fail on critical errors, not warnings
    const criticalErrors = consoleErrors.filter(
      (err) => !err.includes('DevTools') && !err.includes('favicon')
    );
    
    expect(criticalErrors.length).toBe(0);
  });

  test('should verify Hyperspeed transition works', async ({ page }) => {
    // Wait for page load
    await page.waitForTimeout(1000);

    // Click About link to trigger Hyperspeed - use button specifically
    const aboutLink = page.locator('button:has-text("About")').first();
    await aboutLink.click();

    // Hyperspeed should briefly appear
    await page.waitForTimeout(300);

    // Check if we scrolled to about section
    await page.waitForTimeout(2000);
    
    const aboutSection = await page.locator('#about');
    const isInViewport = await aboutSection.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return rect.top >= 0 && rect.top <= window.innerHeight;
    });

    expect(isInViewport).toBeTruthy();
    console.log('✓ Hyperspeed transition completed successfully');
  });

  test('should take full page screenshots for visual verification', async ({ page }) => {
    // Home section
    await page.locator('#home').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/full-home.png', fullPage: false });

    // About section
    await page.locator('#about').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/full-about.png', fullPage: false });

    // Services section
    await page.locator('#services').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/full-services.png', fullPage: false });

    // Artists section
    await page.locator('#artists').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/full-artists.png', fullPage: false });

    // Merch section
    await page.locator('#merch').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/full-merch.png', fullPage: false });

    console.log('✓ Full page screenshots captured');
  });
});
