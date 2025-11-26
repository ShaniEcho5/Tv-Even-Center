// @ts-check
import { test, expect } from '@playwright/test';

const baseURL = 'http://localhost:3000';

test.describe('TV Event Center Website', () => {
  test.beforeEach(async ({ page }) => {
    // Start from the home page before each test
    await page.goto(baseURL);
  });

  test.describe('Home Page', () => {
    test('has correct title and meta information', async ({ page }) => {
      await expect(page).toHaveTitle(/TV Event Center - Celebrate Life's Best Moments/);
      
      // Check meta descriptions
      const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
      expect(metaDescription).toContain('TV Event Center is a luxurious event venue');
    });

    test('displays hero section with main content', async ({ page }) => {
      // Check hero section elements
      await expect(page.getByText("Celebrate Life's Best Moments")).toBeVisible();
      await expect(page.getByText('TV Event Center')).toBeVisible();
      await expect(page.getByRole('link', { name: 'Book Your Event' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'View Gallery' })).toBeVisible();
    });

    test('navigation menu works correctly', async ({ page }) => {
      // Test desktop navigation
      await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Services' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Gallery' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Contact' })).toBeVisible();
    });

    test('displays services preview section', async ({ page }) => {
      await expect(page.getByText('Creating Unforgettable Experiences')).toBeVisible();
      await expect(page.getByText('Wedding Functions')).toBeVisible();
      await expect(page.getByText('Corporate Events')).toBeVisible();
    });

    test('displays testimonials section', async ({ page }) => {
      await expect(page.getByText('What Our Clients Say')).toBeVisible();
      await expect(page.getByText('4.9/5 Average Rating')).toBeVisible();
    });

    test('footer contains all necessary information', async ({ page }) => {
      // Scroll to footer
      await page.locator('footer').scrollIntoViewIfNeeded();
      
      await expect(page.getByText('TV Event Center', { exact: false })).toBeVisible();
      await expect(page.getByText('Quick Links')).toBeVisible();
      await expect(page.getByText('Our Services')).toBeVisible();
      await expect(page.getByText('Get In Touch')).toBeVisible();
    });
  });

  test.describe('About Page', () => {
    test('navigates to about page and displays content', async ({ page }) => {
      await page.getByRole('link', { name: 'About' }).click();
      await expect(page).toHaveURL(`${baseURL}/about`);
      
      await expect(page.getByText('Creating Memories Since')).toBeVisible();
      await expect(page.getByText('A Journey of Excellence')).toBeVisible();
      await expect(page.getByText('Our Mission')).toBeVisible();
      await expect(page.getByText('Our Vision')).toBeVisible();
    });

    test('displays company statistics', async ({ page }) => {
      await page.goto(`${baseURL}/about`);
      
      await expect(page.getByText('10+')).toBeVisible();
      await expect(page.getByText('1000+')).toBeVisible();
      await expect(page.getByText('500+')).toBeVisible();
    });
  });

  test.describe('Services Page', () => {
    test('navigates to services page and displays all services', async ({ page }) => {
      await page.getByRole('link', { name: 'Services' }).click();
      await expect(page).toHaveURL(`${baseURL}/services`);
      
      await expect(page.getByText('Complete Event Solutions')).toBeVisible();
      await expect(page.getByText('Wedding Functions')).toBeVisible();
      await expect(page.getByText('Corporate Events')).toBeVisible();
      await expect(page.getByText('Birthday Parties')).toBeVisible();
    });

    test('displays service categories', async ({ page }) => {
      await page.goto(`${baseURL}/services`);
      
      await expect(page.getByText('Weddings')).toBeVisible();
      await expect(page.getByText('Corporate')).toBeVisible();
      await expect(page.getByText('Social Events')).toBeVisible();
      await expect(page.getByText('Religious')).toBeVisible();
    });
  });

  test.describe('Gallery Page', () => {
    test('navigates to gallery page and displays images', async ({ page }) => {
      await page.getByRole('link', { name: 'Gallery' }).click();
      await expect(page).toHaveURL(`${baseURL}/gallery`);
      
      await expect(page.getByText('Moments Worth Celebrating')).toBeVisible();
      await expect(page.getByText('Filter by category:')).toBeVisible();
    });

    test('gallery filter functionality works', async ({ page }) => {
      await page.goto(`${baseURL}/gallery`);
      
      // Test filter buttons
      await expect(page.getByRole('button', { name: 'All Events' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Weddings' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Corporate' })).toBeVisible();
      
      // Click on Weddings filter
      await page.getByRole('button', { name: 'Weddings' }).click();
      
      // Verify images are displayed (at least one image should be visible)
      await expect(page.locator('img[alt*="wedding"], img[alt*="Wedding"]').first()).toBeVisible();
    });
  });

  test.describe('Contact Page', () => {
    test('navigates to contact page and displays form', async ({ page }) => {
      await page.getByRole('link', { name: 'Contact' }).click();
      await expect(page).toHaveURL(`${baseURL}/contact`);
      
      await expect(page.getByText('Let\'s Create Something Amazing')).toBeVisible();
      await expect(page.getByText('Start Planning Your Event')).toBeVisible();
    });

    test('contact form validation works', async ({ page }) => {
      await page.goto(`${baseURL}/contact`);
      
      // Try to submit empty form
      await page.getByRole('button', { name: 'Send Message' }).click();
      
      // Check for HTML5 validation (required fields)
      const nameInput = page.getByLabel('Full Name');
      await expect(nameInput).toBeVisible();
      
      const emailInput = page.getByLabel('Email Address');
      await expect(emailInput).toBeVisible();
    });

    test('contact form submission works', async ({ page }) => {
      await page.goto(`${baseURL}/contact`);
      
      // Fill out the form
      await page.getByLabel('Full Name').fill('John Doe');
      await page.getByLabel('Email Address').fill('john@example.com');
      await page.getByLabel('Phone Number').fill('+1234567890');
      await page.getByLabel('Event Type').selectOption('Wedding');
      await page.getByLabel('Expected Guest Count').fill('100');
      await page.getByLabel('Message').fill('Test message for event planning.');
      
      // Submit the form
      await page.getByRole('button', { name: 'Send Message' }).click();
      
      // Wait for success message
      await expect(page.getByText('Thank You!')).toBeVisible({ timeout: 10000 });
    });

    test('displays contact information', async ({ page }) => {
      await page.goto(`${baseURL}/contact`);
      
      await expect(page.getByText('Address')).toBeVisible();
      await expect(page.getByText('Phone')).toBeVisible();
      await expect(page.getByText('Email')).toBeVisible();
      await expect(page.getByText('Business Hours')).toBeVisible();
    });
  });

  test.describe('Responsive Design', () => {
    test('mobile navigation works correctly', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(baseURL);
      
      // Check if mobile menu button is visible
      const menuButton = page.getByRole('button', { name: 'Toggle menu' });
      await expect(menuButton).toBeVisible();
      
      // Click mobile menu button
      await menuButton.click();
      
      // Check if mobile menu items are visible
      await expect(page.getByText('Home')).toBeVisible();
      await expect(page.getByText('About')).toBeVisible();
    });

    test('responsive layout on tablet', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(baseURL);
      
      // Check if main content is properly displayed
      await expect(page.getByText("Celebrate Life's Best Moments")).toBeVisible();
      await expect(page.getByRole('link', { name: 'Book Your Event' })).toBeVisible();
    });
  });

  test.describe('SEO and Accessibility', () => {
    test('has proper heading structure', async ({ page }) => {
      await page.goto(baseURL);
      
      // Check for proper heading hierarchy
      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();
      
      const h2Elements = page.locator('h2');
      expect(await h2Elements.count()).toBeGreaterThan(0);
    });

    test('images have alt attributes', async ({ page }) => {
      await page.goto(baseURL);
      
      // Wait for images to load
      await page.waitForLoadState('networkidle');
      
      const images = page.locator('img');
      const imageCount = await images.count();
      
      for (let i = 0; i < Math.min(imageCount, 5); i++) {
        const altText = await images.nth(i).getAttribute('alt');
        expect(altText).toBeTruthy();
      }
    });

    test('has proper meta tags', async ({ page }) => {
      await page.goto(baseURL);
      
      // Check viewport meta tag
      const viewportMeta = await page.locator('meta[name="viewport"]').getAttribute('content');
      expect(viewportMeta).toContain('width=device-width');
      
      // Check description meta tag
      const descriptionMeta = await page.locator('meta[name="description"]').getAttribute('content');
      expect(descriptionMeta).toBeTruthy();
    });
  });

  test.describe('Performance', () => {
    test('page loads within reasonable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto(baseURL);
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      // Expect page to load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    test('hero image loads properly', async ({ page }) => {
      await page.goto(baseURL);
      
      // Wait for hero image to load
      const heroImage = page.locator('section img').first();
      await expect(heroImage).toBeVisible();
    });
  });
});
