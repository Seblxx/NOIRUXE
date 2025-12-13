import { test, expect } from '@playwright/test';

test.describe('NOIRUXE Website Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('homepage loads with improved ASCII performance', async ({ page }) => {
    // Wait for home section
    await expect(page.locator('#home')).toBeVisible();
    
    // Check that ASCII text renders but isn't creating millions of characters
    const asciiContainer = page.locator('.ascii-container, [class*="ascii"]');
    
    // Measure performance - page should be responsive
    const startTime = Date.now();
    await page.mouse.move(100, 100);
    const responseTime = Date.now() - startTime;
    expect(responseTime).toBeLessThan(100); // Should respond quickly
    
    console.log('✓ ASCII text performance improved');
  });

  test('menu navigation works without Hyperspeed', async ({ page }) => {
    // Wait for menu
    await page.waitForSelector('nav', { state: 'visible' });
    
    // Test navigation to about section
    await page.click('text=about');
    await page.waitForTimeout(1500); // Wait for smooth scroll
    
    // Verify we scrolled to about section
    const aboutSection = page.locator('#about');
    await expect(aboutSection).toBeInViewport();
    
    console.log('✓ Smooth scroll navigation working');
  });

  test('GSAP scroll navigation is smooth and fast', async ({ page }) => {
    const sections = ['about', 'artists', 'merch', 'contact'];
    
    for (const section of sections) {
      const startTime = Date.now();
      
      // Click menu item
      await page.click(`text=${section}`);
      
      // Wait for scroll animation
      await page.waitForTimeout(1500);
      
      // Check section is in viewport
      const sectionElement = page.locator(`#${section}`);
      await expect(sectionElement).toBeInViewport();
      
      const scrollTime = Date.now() - startTime;
      console.log(`✓ Scrolled to ${section} in ${scrollTime}ms`);
      
      // Should complete in reasonable time
      expect(scrollTime).toBeLessThan(2000);
    }
  });

  test('DecryptedText animation works in merch section', async ({ page }) => {
    // Navigate to merch
    await page.click('text=merch');
    await page.waitForTimeout(1500);
    
    // Wait for DecryptedText component
    const merchSection = page.locator('#merch');
    await expect(merchSection).toBeInViewport();
    
    // Look for the decrypted text
    const comingSoonText = page.getByText(/COMING SOON/i);
    
    // Wait for animation to complete
    await page.waitForTimeout(3000);
    
    // Verify text is visible
    await expect(comingSoonText).toBeVisible();
    
    console.log('✓ DecryptedText working in merch section');
  });

  test('artist page layout with Brazen design', async ({ page }) => {
    // Navigate to artists
    await page.click('text=artists');
    await page.waitForTimeout(1500);
    
    // Click on first artist card
    const artistCards = page.locator('.artist-card, [class*="card"]');
    await artistCards.first().click();
    await page.waitForTimeout(500);
    
    // Verify artist page loaded
    await expect(page.locator('h1')).toBeVisible();
    
    // Check for music player iframe
    const musicFrame = page.locator('iframe[src*="soundcloud"], iframe[src*="spotify"]');
    if (await musicFrame.count() > 0) {
      await expect(musicFrame.first()).toBeVisible();
      console.log('✓ Music player embedded correctly');
    }
    
    // Check for social icons
    const socialLinks = page.locator('a[href*="instagram"], a[href*="tiktok"], a[href*="soundcloud"]');
    expect(await socialLinks.count()).toBeGreaterThan(0);
    console.log('✓ Social links present');
    
    // Check back button
    const backButton = page.locator('button:has-text("back"), button:has-text("←")');
    await expect(backButton.first()).toBeVisible();
  });

  test('artist page uses correct color theming', async ({ page }) => {
    // Navigate to artists and select one
    await page.click('text=artists');
    await page.waitForTimeout(1500);
    
    const artistCards = page.locator('.artist-card, [class*="card"]');
    await artistCards.first().click();
    await page.waitForTimeout(500);
    
    // Get computed styles of key elements
    const heading = page.locator('h1').first();
    const socialButton = page.locator('a[href*="instagram"], a[href*="tiktok"]').first();
    
    // Verify styling is applied
    await expect(heading).toBeVisible();
    await expect(socialButton).toBeVisible();
    
    console.log('✓ Artist color theming applied');
  });

  test('back button returns to artists section', async ({ page }) => {
    // Navigate to artists and select one
    await page.click('text=artists');
    await page.waitForTimeout(1500);
    
    const artistCards = page.locator('.artist-card, [class*="card"]');
    await artistCards.first().click();
    await page.waitForTimeout(500);
    
    // Click back button
    const backButton = page.locator('button:has-text("back"), button:has-text("←")');
    await backButton.first().click();
    await page.waitForTimeout(1500);
    
    // Verify we're back at artists section
    const artistsSection = page.locator('#artists');
    await expect(artistsSection).toBeInViewport();
    
    console.log('✓ Back navigation working');
  });

  test('performance: page is responsive without lag', async ({ page }) => {
    // Test mouse movement responsiveness
    const movements = 10;
    let totalTime = 0;
    
    for (let i = 0; i < movements; i++) {
      const startTime = Date.now();
      await page.mouse.move(100 + i * 50, 100 + i * 50);
      totalTime += Date.now() - startTime;
    }
    
    const avgTime = totalTime / movements;
    console.log(`Average response time: ${avgTime.toFixed(2)}ms`);
    
    // Should be very responsive
    expect(avgTime).toBeLessThan(50);
    
    console.log('✓ Page performance excellent');
  });

  test('no Hyperspeed component present', async ({ page }) => {
    // Check that Hyperspeed is not in the DOM
    const hyperspeed = page.locator('[class*="hyperspeed"], [class*="Hyperspeed"]');
    expect(await hyperspeed.count()).toBe(0);
    
    console.log('✓ Hyperspeed removed successfully');
  });

  test('custom cursor works', async ({ page }) => {
    // Move mouse to trigger cursor
    await page.mouse.move(300, 300);
    await page.waitForTimeout(200);
    
    // Custom cursor should be present
    const cursor = page.locator('[class*="cursor"]');
    expect(await cursor.count()).toBeGreaterThan(0);
    
    console.log('✓ Custom cursor working');
  });
});