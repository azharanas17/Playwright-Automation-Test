import { Page, Locator } from '@playwright/test';
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

  async addToCart() {
    await this.addToCartButton.click();
  }
}