import { test, expect } from '@playwright/test';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { BASE_URL, productCategories, specificProduct } from './fixtures/testData';

test.describe('Product Browsing', () => {
  test('should display products on homepage', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto(BASE_URL);
    await expect(productsPage.productNames.first()).toBeVisible();
    const count = await productsPage.getProductCount();
    expect(count).toBeGreaterThan(0);
    await page.screenshot({ path: 'screenshots/products/homepage.png' });
  });

  test('should display correct page title', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto(BASE_URL);
    await expect(page).toHaveTitle('STORE');
    await page.screenshot({ path: 'screenshots/products/homepage-title.png' });
  });

  test('should navigate to product detail when clicking a product', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto(BASE_URL);
    await productsPage.clickFirstProduct();
    await page.waitForSelector('.name');

    const detailPage = new ProductDetailPage(page);
    await expect(detailPage.productName).toBeVisible();
    await expect(detailPage.productName).not.toBeEmpty();
    await page.screenshot({ path: 'screenshots/products/product-detail.png' });
  });

  test('should display product price on detail page', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto(BASE_URL);
    await productsPage.clickFirstProduct();

    const detailPage = new ProductDetailPage(page);
    await expect(detailPage.productPrice).toBeVisible();
    await page.screenshot({ path: 'screenshots/products/product-price.png' });
  });

  test('should display "Add to cart" button on detail page', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto(BASE_URL);
    await productsPage.clickFirstProduct();
    await page.waitForSelector('.btn-success');

    const detailPage = new ProductDetailPage(page);
    await expect(detailPage.addToCartButton).toBeVisible();
    await page.screenshot({ path: 'screenshots/products/add-to-cart-button.png' });
  });

  test('should navigate to specific product by name', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto(BASE_URL);
    await productsPage.clickProductByName(specificProduct);
    await page.waitForSelector('.name');

    const detailPage = new ProductDetailPage(page);
    await expect(detailPage.productName).toHaveText(specificProduct);
    await page.screenshot({ path: 'screenshots/products/samsung-s6-detail.png' });
  });

  test('should navigate back to homepage from product detail', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto(BASE_URL);
    await productsPage.clickFirstProduct();
    await productsPage.navigateHome();

    await expect(page).toHaveURL(/demoblaze\.com/);
    await page.screenshot({ path: 'screenshots/products/back-home.png' });
  });
});

test.describe('Product Categories', () => {
  test('should display 3 category buttons', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto(BASE_URL);
    await expect(productsPage.categoryLinks).toHaveCount(3);
    await page.screenshot({ path: 'screenshots/products/categories.png' });
  });

  for (const category of productCategories) {
    test(`should filter products by "${category}" category`, async ({ page }) => {
      const productsPage = new ProductsPage(page);
      await productsPage.goto(BASE_URL);
      await productsPage.clickCategory(category);
      await page.waitForSelector('.card-title a');
      const count = await productsPage.getProductCount();
      expect(count).toBeGreaterThan(0);
      await page.screenshot({ path: `screenshots/products/category-${category.toLowerCase()}.png` });
    });
  }
});
