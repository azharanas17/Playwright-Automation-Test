import { test, expect } from '@playwright/test';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { BASE_URL, checkoutData } from './fixtures/testData';

test.describe('Shopping Cart', () => {
  test('should add a product to cart and verify total price', async ({ page }, testInfo) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto(BASE_URL);
    await productsPage.clickFirstProduct();

    const detailPage = new ProductDetailPage(page);
    page.once('dialog', async (dialog) => await dialog.accept());
    await detailPage.addToCart();

    await productsPage.navigateToCart();
    await page.waitForSelector('#tbodyid tr', { timeout: 10000 });

    const cartPage = new CartPage(page);
    await expect(cartPage.totalPrice).not.toBeEmpty();
    await page.screenshot({ path: `screenshots/${testInfo.project.name}/cart/01-cart-with-item.png` });
  });
});

test.describe('Checkout Process', () => {
  test('should complete checkout with valid data', async ({ page }, testInfo) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto(BASE_URL);
    await productsPage.clickFirstProduct();

    const detailPage = new ProductDetailPage(page);
    page.once('dialog', async (dialog) => await dialog.accept());
    await detailPage.addToCart();

    await productsPage.navigateToCart();
    await page.waitForSelector('#tbodyid tr', { timeout: 15000 });
    await page.screenshot({ path: `screenshots/${testInfo.project.name}/cart/02-cart-before-checkout.png` });

    const cartPage = new CartPage(page);
    await cartPage.clickPlaceOrder();

    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.fillCheckoutForm(checkoutData);
    await page.screenshot({ path: `screenshots/${testInfo.project.name}/cart/03-checkout-form.png` });
    await checkoutPage.purchase();

    const message = await checkoutPage.getConfirmationMessage();
    expect(message).toContain('Thank you for your purchase!');
    await page.screenshot({ path: `screenshots/${testInfo.project.name}/cart/04-checkout-success.png` });

    await checkoutPage.confirmPurchase();
  });


});