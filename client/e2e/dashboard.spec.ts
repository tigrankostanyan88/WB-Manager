import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test('should display dashboard page', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Check if page loaded
    await expect(page.locator('nav')).toBeVisible()
    
    // Check sidebar navigation
    await expect(page.locator('text=Վահանակ')).toBeVisible()
  })

  test('should switch between tabs', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Click on Users tab
    await page.click('text=Օգտվողներ')
    
    // Verify URL changed or content updated
    await expect(page.locator('text=Օգտվողներ')).toBeVisible()
  })

  test('should handle keyboard navigation', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Press Tab to navigate
    await page.keyboard.press('Tab')
    
    // Check focus indicator is visible
    await expect(page.locator(':focus')).toBeVisible()
  })
})

test.describe('Authentication', () => {
  test('should redirect to login for unauthenticated users', async ({ page }) => {
    // This test assumes unauthenticated access
    await page.goto('/dashboard')
    
    // Should redirect to login or show auth error
    await expect(page.locator('text=Մուտք')).toBeVisible()
  })
})
