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
  });

  test('should display correct page title', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto(BASE_URL);
    await expect(page).toHaveTitle('STORE');
  });

  test('should navigate to product detail when clicking a product', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto(BASE_URL);
    await productsPage.clickFirstProduct();
    await page.waitForSelector('.name');

    const detailPage = new ProductDetailPage(page);
    await expect(detailPage.productName).toBeVisible();
    await expect(detailPage.productName).not.toBeEmpty();
  });

  test('should display product price on detail page', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto(BASE_URL);
    await productsPage.clickFirstProduct();

    const detailPage = new ProductDetailPage(page);
    await expect(detailPage.productPrice).toBeVisible();
  });

  test('should display "Add to cart" button on detail page', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto(BASE_URL);
    await productsPage.clickFirstProduct();
    await page.waitForSelector('.btn-success');

    const detailPage = new ProductDetailPage(page);
    await expect(detailPage.addToCartButton).toBeVisible();
  });

  test('should navigate to specific product by name', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto(BASE_URL);
    await productsPage.clickProductByName(specificProduct);
    await page.waitForSelector('.name');

    const detailPage = new ProductDetailPage(page);
    await expect(detailPage.productName).toHaveText(specificProduct);
  });

  test('should navigate back to homepage from product detail', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto(BASE_URL);
    await productsPage.clickFirstProduct();
    await productsPage.navigateHome();

    await expect(page).toHaveURL(/demoblaze\.com/);
  });
});

test.describe('Product Categories', () => {
  test('should display 3 category buttons', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto(BASE_URL);
    await expect(productsPage.categoryLinks).toHaveCount(3);
  });

  for (const category of productCategories) {
    test(`should filter products by "${category}" category`, async ({ page }) => {
      const productsPage = new ProductsPage(page);
      await productsPage.goto(BASE_URL);
      await productsPage.clickCategory(category);
      await page.waitForSelector('.card-title a');
      const count = await productsPage.getProductCount();
      expect(count).toBeGreaterThan(0);
    });
  }
});
