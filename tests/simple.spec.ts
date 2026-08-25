import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.demoblaze.com/';

test.describe('Homepage - Basic Assertions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('should display correct page title', async ({ page }) => {
    await expect(page).toHaveTitle('STORE');
  });

  test('should display products on homepage', async ({ page }) => {
    const products = page.locator('.card-title a');
    await expect(products.first()).toBeVisible();
    const count = await products.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display product name containing specific text', async ({ page }) => {
    const firstProduct = page.locator('.card-title a').first();
    await expect(firstProduct).toContainText('Samsung');
  });

  test('should have navigation links visible', async ({ page }) => {
    await expect(page.locator('#nava')).toBeVisible();
  });

  test('should display login link in navbar', async ({ page }) => {
    const loginLink = page.locator('#login2');
    await expect(loginLink).toBeVisible();
    await expect(loginLink).toHaveText('Log in');
  });

  test('should display signup link in navbar', async ({ page }) => {
    const signupLink = page.locator('#signin2');
    await expect(signupLink).toBeVisible();
    await expect(signupLink).toHaveText('Sign up');
  });

  test('should display cart link in navbar', async ({ page }) => {
    const cartLink = page.locator('#cartur');
    await expect(cartLink).toBeVisible();
  });
});

test.describe('Categories - Basic Assertions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('should display 3 category buttons', async ({ page }) => {
    const categories = page.locator('.list-group-item#itemc');
    await expect(categories).toHaveCount(3);
  });

  test('should display "Phones" category', async ({ page }) => {
    const phonesCategory = page.getByText('Phones', { exact: true });
    await expect(phonesCategory).toBeVisible();
  });

  test('should display "Laptops" category', async ({ page }) => {
    const laptopsCategory = page.getByText('Laptops', { exact: true });
    await expect(laptopsCategory).toBeVisible();
  });

  test('should display "Monitors" category', async ({ page }) => {
    const monitorsCategory = page.getByText('Monitors', { exact: true });
    await expect(monitorsCategory).toBeVisible();
  });
});

test.describe('Product Detail - Basic Assertions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('should navigate to product detail when clicking a product', async ({ page }) => {
    const firstProduct = page.locator('.card-title a').first();
    await firstProduct.click();

    const detailName = page.locator('.name');
    await expect(detailName).toBeVisible();
    await expect(detailName).not.toBeEmpty();
  });

  test('should display product price on detail page', async ({ page }) => {
    const firstProduct = page.locator('.card-title a').first();
    await firstProduct.click();

    const price = page.locator('.price-container');
    await expect(price).toBeVisible();
  });

  test('should display "Add to cart" button on detail page', async ({ page }) => {
    const firstProduct = page.locator('.card-title a').first();
    await firstProduct.click();

    const addToCartBtn = page.locator('.btn-success', { hasText: 'Add to cart' });
    await expect(addToCartBtn).toBeVisible();
  });

  test('should navigate to specific product by name', async ({ page }) => {
    const productLink = page.getByRole('link', { name: 'Samsung galaxy s6' });
    await productLink.click();

    const detailName = page.locator('.name');
    await expect(detailName).toHaveText('Samsung galaxy s6');
  });
});

test.describe('Login Modal - Basic Assertions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('should open login modal when clicking login link', async ({ page }) => {
    await page.locator('#login2').click();

    const loginModal = page.locator('#logInModal');
    await expect(loginModal).toBeVisible();
  });

  test('should display username and password fields in login modal', async ({ page }) => {
    await page.locator('#login2').click();

    await expect(page.locator('#loginusername')).toBeVisible();
    await expect(page.locator('#loginpassword')).toBeVisible();
  });

  test('should display login button in modal', async ({ page }) => {
    await page.locator('#login2').click();

    const loginButton = page.locator('#logInModal').getByRole('button', { name: 'Log in' });
    await expect(loginButton).toBeVisible();
  });

  test('should show alert with invalid credentials', async ({ page }) => {
    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toContain('User does not exist.');
      await dialog.accept();
    });

    await page.locator('#login2').click();
    await page.locator('#loginusername').fill('invaliduser9x7k2m');
    await page.locator('#loginpassword').fill('wrongpassword');
    await page.locator('#logInModal').getByRole('button', { name: 'Log in' }).click();
  });

  test('should show alert with empty credentials', async ({ page }) => {
    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Please fill out Username and Password.');
      await dialog.accept();
    });

    await page.locator('#login2').click();
    await page.locator('#logInModal').getByRole('button', { name: 'Log in' }).click();
  });
});
