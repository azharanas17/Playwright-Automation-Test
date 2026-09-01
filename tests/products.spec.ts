import { test, expect } from '@playwright/test';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { BASE_URL, productCategories, specificProduct } from './fixtures/testData';

test.describe('Product Browsing', () => {
  test('should display products on homepage', async ({ page }, testInfo) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto(BASE_URL);
    await expect(productsPage.productNames.first()).toBeVisible();
    const count = await productsPage.getProductCount();
    expect(count).toBeGreaterThan(0);
    await page.screenshot({ path: `screenshots/${testInfo.project.name}/products/01-homepage.png` });
  });

  test('should display correct page title', async ({ page }, testInfo) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto(BASE_URL);
    await expect(page).toHaveTitle('STORE');
    await page.screenshot({ path: `screenshots/${testInfo.project.name}/products/02-homepage-title.png` });
  });

  test('should navigate to product detail when clicking a product', async ({ page }, testInfo) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto(BASE_URL);
    await productsPage.clickFirstProduct();

    const detailPage = new ProductDetailPage(page);
    await expect(detailPage.productName).toBeVisible();
    await expect(detailPage.productName).not.toBeEmpty();
    await page.screenshot({ path: `screenshots/${testInfo.project.name}/products/03-product-detail.png` });
  });

  test('should display product price on detail page', async ({ page }, testInfo) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto(BASE_URL);
    await productsPage.clickFirstProduct();

    const detailPage = new ProductDetailPage(page);
    await expect(detailPage.productPrice).toBeVisible();
    await page.screenshot({ path: `screenshots/${testInfo.project.name}/products/04-product-price.png` });
  });

  test('should display "Add to cart" button on detail page', async ({ page }, testInfo) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto(BASE_URL);
    await productsPage.clickFirstProduct();

    const detailPage = new ProductDetailPage(page);
    await expect(detailPage.addToCartButton).toBeVisible();
    await page.screenshot({ path: `screenshots/${testInfo.project.name}/products/05-add-to-cart-button.png` });
  });

  test('should navigate to specific product by name', async ({ page }, testInfo) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto(BASE_URL);
    await productsPage.clickProductByName(specificProduct);

    const detailPage = new ProductDetailPage(page);
    await expect(detailPage.productName).toHaveText(specificProduct);
    await page.screenshot({ path: `screenshots/${testInfo.project.name}/products/06-samsung-s6-detail.png` });
  });

  test('should navigate back to homepage from product detail', async ({ page }, testInfo) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto(BASE_URL);
    await productsPage.clickFirstProduct();
    await productsPage.navigateHome();

    await expect(page).toHaveURL(/demoblaze\.com/);
    await page.screenshot({ path: `screenshots/${testInfo.project.name}/products/07-back-home.png` });
  });
});

test.describe('Product Categories', () => {
  test('should display 3 category buttons', async ({ page }, testInfo) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto(BASE_URL);
    await expect(productsPage.categoryLinks).toHaveCount(3);
    await page.screenshot({ path: `screenshots/${testInfo.project.name}/products/08-categories.png` });
  });

  for (const category of productCategories) {
    test(`should filter products by "${category}" category`, async ({ page }, testInfo) => {
      const productsPage = new ProductsPage(page);
      await productsPage.goto(BASE_URL);
      await productsPage.clickCategory(category);
      await expect(productsPage.productNames.first()).toBeVisible();
      const count = await productsPage.getProductCount();
      expect(count).toBeGreaterThan(0);
      const num = String(productCategories.indexOf(category) + 9).padStart(2, '0');
      await page.screenshot({ path: `screenshots/${testInfo.project.name}/products/${num}-category-${category.toLowerCase()}.png` });
    });
  }
});