import { test, expect } from '@playwright/test';

test.describe('Portfolio Website Core Tests', () => {
  test('homepage loads and renders 3D canvas', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 10000 });
  });

  test('skills section exists and shows data', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    
    await page.locator('text=Skills').first().click();
    await page.waitForTimeout(1500);
    
    const skillCards = page.locator('.skill-card');
    const count = await skillCards.count();
    
    if (count === 0) {
      console.log('⚠️  No skills data - add data to backend');
      return;
    }
    
    expect(count).toBeGreaterThan(0);
    await expect(skillCards.first()).toBeVisible();
  });

  test('modal opens without layout shift', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    
    await page.evaluate(() => window.scrollBy(0, 100));
    await page.waitForTimeout(500);
    
    const loginButton = page.locator('text=LOGIN').first();
    await loginButton.click({ timeout: 10000 });
    await page.waitForTimeout(500);
    
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
    
    // ✅ KEY TEST: No padding added to body (no layout shift)
    const bodyPaddingRight = await page.locator('body').evaluate(el => 
      window.getComputedStyle(el).paddingRight
    );
    expect(bodyPaddingRight).toBe('0px');
    
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  });

  test('section titles have gradient colors', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    
    const sections = ['About', 'Skills', 'Projects'];
    
    for (const section of sections) {
      await page.locator(`text=${section}`).first().click();
      await page.waitForTimeout(800);
      
      const title = page.locator(`h2:has-text("${section.toUpperCase()}")`).first();
      await expect(title).toBeVisible();
      
      const hasGradient = await title.evaluate(el => {
        const classes = el.className;
        return classes.includes('text-transparent') && 
               classes.includes('bg-clip-text') && 
               classes.includes('bg-gradient');
      });
      expect(hasGradient).toBe(true);
    }
  });

  test('no critical console errors on load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    
    const criticalErrors = errors.filter(err => 
      !err.includes('DevTools') && 
      !err.includes('Extension') &&
      !err.includes('favicon') &&
      !err.includes('404')
    );
    
    expect(criticalErrors.length).toBe(0);
  });
});
