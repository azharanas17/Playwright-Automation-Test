import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  readonly productNames: Locator;
  readonly productPrices: Locator;
  readonly productLinks: Locator;
  readonly cartLink: Locator;
  readonly categoryLinks: Locator;
  readonly homeLink: Locator;

  constructor(page: Page) {
    super(page);
    this.productNames = page.locator('.card-title a');
    this.productPrices = page.locator('.card h4');
    this.productLinks = page.locator('.card-title a.hrefch');
    this.cartLink = page.locator('#cartur');
    this.categoryLinks = page.locator('.list-group-item#itemc');
    this.homeLink = page.locator('a.navbar-brand');
  }

  async getProductCount() {
    return await this.productNames.count();
  }

  async clickProductByName(name: string) {
    await this.page.getByRole('link', { name }).click();
  }

  async clickFirstProduct() {
    await this.productLinks.first().click();
  }

  async clickCategory(categoryName: string) {
    await Promise.all([
      this.page.waitForResponse(
        (response) => response.url().includes('/bycat') && response.status() === 200
      ),
      this.categoryLinks.getByText(categoryName, { exact: true }).click(),
    ]);
  }

  async navigateToCart() {
    await this.cartLink.click();
  }

  async navigateHome() {
    await this.homeLink.click();
  }
}