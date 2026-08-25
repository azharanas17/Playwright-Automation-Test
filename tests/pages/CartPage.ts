import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly cartItemNames: Locator;
  readonly cartItemPrices: Locator;
  readonly totalPrice: Locator;
  readonly placeOrderButton: Locator;
  readonly deleteButtons: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('#tbodyid tr');
    this.cartItemNames = page.locator('#tbodyid td:nth-child(2)');
    this.cartItemPrices = page.locator('#tbodyid td:nth-child(3)');
    this.totalPrice = page.locator('#totalp');
    this.placeOrderButton = page.locator('.btn-success', { hasText: 'Place Order' });
    this.deleteButtons = page.locator('#tbodyid tr td:last-child a');
  }

  async getItemCount() {
    return await this.cartItems.count();
  }

  async deleteFirstItem() {
    await this.deleteButtons.first().click();
  }

  async clickPlaceOrder() {
    await this.placeOrderButton.click();
  }
}
