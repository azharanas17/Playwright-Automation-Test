import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  readonly nameField: Locator;
  readonly countryField: Locator;
  readonly cityField: Locator;
  readonly cardField: Locator;
  readonly monthField: Locator;
  readonly yearField: Locator;
  readonly purchaseButton: Locator;
  readonly confirmationMessage: Locator;
  readonly confirmButton: Locator;

  constructor(page: Page) {
    super(page);
    this.nameField = page.locator('#name');
    this.countryField = page.locator('#country');
    this.cityField = page.locator('#city');
    this.cardField = page.locator('#card');
    this.monthField = page.locator('#month');
    this.yearField = page.locator('#year');
    this.purchaseButton = page.getByRole('button', { name: 'Purchase' });
    this.confirmationMessage = page.locator('.sweet-alert h2');
    this.confirmButton = page.locator('.confirm');
  }

  async fillCheckoutForm(data: {
    name: string;
    country: string;
    city: string;
    card: string;
    month: string;
    year: string;
  }) {
    await this.nameField.fill(data.name);
    await this.countryField.fill(data.country);
    await this.cityField.fill(data.city);
    await this.cardField.fill(data.card);
    await this.monthField.fill(data.month);
    await this.yearField.fill(data.year);
  }

  async purchase() {
    await this.purchaseButton.click();
    await this.page.waitForSelector('.sweet-alert h2');
  }

  async getConfirmationMessage() {
    return await this.confirmationMessage.textContent();
  }

  async confirmPurchase() {
    await this.confirmButton.click();
  }
}
