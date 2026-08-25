import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductDetailPage extends BasePage {
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly productDescription: Locator;
  readonly addToCartButton: Locator;
  readonly moreInfoSection: Locator;

  constructor(page: Page) {
    super(page);
    this.productName = page.locator('.name');
    this.productPrice = page.locator('.price-container');
    this.productDescription = page.locator('.description');
    this.addToCartButton = page.locator('.btn-success', { hasText: 'Add to cart' });
    this.moreInfoSection = page.locator('#more-information');
  }

  async getProductName() {
    return await this.productName.textContent();
  }

  async addToCart() {
    await this.addToCartButton.click();
    await this.page.waitForTimeout(500);
  }
}
