import { test, expect, Page } from '@playwright/test';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { BASE_URL, checkoutData } from './fixtures/testData';

async function addFirstProductToCart(page: Page): Promise<ProductsPage> {
  const productsPage = new ProductsPage(page);
  await productsPage.goto(BASE_URL);
  await productsPage.clickFirstProduct();
  const dialogAccepted = page.waitForEvent('dialog').then(async (dialog) => {
    await dialog.accept();
  });
  const detailPage = new ProductDetailPage(page);
  await detailPage.addToCart();
  await dialogAccepted;
  return productsPage;
}

test.describe('Shopping Cart', () => {
  test('should add a product to cart and verify total price', async ({ page }, testInfo) => {
    const productsPage = await addFirstProductToCart(page);
    await productsPage.navigateToCart();

    const cartPage = new CartPage(page);
    await expect(cartPage.cartItems.first()).toBeVisible();
    await expect(cartPage.totalPrice).not.toBeEmpty();
    await page.screenshot({ path: `screenshots/${testInfo.project.name}/cart/01-cart-with-item.png` });
  });
});

test.describe('Checkout Process', () => {
  test('should complete checkout with valid data', async ({ page }, testInfo) => {
    const productsPage = await addFirstProductToCart(page);
    await productsPage.navigateToCart();

    const cartPage = new CartPage(page);
    await expect(cartPage.cartItems.first()).toBeVisible();
    await page.screenshot({ path: `screenshots/${testInfo.project.name}/cart/02-cart-before-checkout.png` });
    await cartPage.clickPlaceOrder();

    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.fillCheckoutForm(checkoutData);
    await page.screenshot({ path: `screenshots/${testInfo.project.name}/cart/03-checkout-form.png` });
    await checkoutPage.purchase();

    await expect(checkoutPage.confirmationMessage).toContainText('Thank you for your purchase!');
    await page.screenshot({ path: `screenshots/${testInfo.project.name}/cart/04-checkout-success.png` });
    await checkoutPage.confirmPurchase();
  });


});