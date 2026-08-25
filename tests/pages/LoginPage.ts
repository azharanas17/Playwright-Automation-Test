import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly loginLink: Locator;
  readonly signupLink: Locator;
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly loginButton: Locator;
  readonly signupUsernameField: Locator;
  readonly signupPasswordField: Locator;
  readonly signupButton: Locator;
  readonly loggedInUser: Locator;
  readonly loginModal: Locator;

  constructor(page: Page) {
    super(page);
    this.loginLink = page.locator('#login2');
    this.signupLink = page.locator('#signin2');
    this.loginModal = page.locator('#logInModal');
    this.usernameField = page.locator('#loginusername');
    this.passwordField = page.locator('#loginpassword');
    this.loginButton = this.loginModal.getByRole('button', { name: 'Log in' });
    this.signupUsernameField = page.locator('#sign-username');
    this.signupPasswordField = page.locator('#sign-password');
    this.signupButton = page.getByRole('button', { name: 'Sign up' });
    this.loggedInUser = page.locator('#nameofuser');
  }

  async openLoginModal() {
    await this.loginLink.click();
    await expect(this.loginModal).toBeVisible();
  }

  async login(username: string, password: string) {
    await this.openLoginModal();
    await this.usernameField.waitFor({ state: 'visible' });
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    await this.loginButton.click();
  }

  async openSignupModal() {
    await this.signupLink.click();
  }

  async signup(username: string, password: string) {
    await this.openSignupModal();
    await this.signupUsernameField.fill(username);
    await this.signupPasswordField.fill(password);
    await this.signupButton.click();
  }

  async closeSignupModal() {
    await this.page.evaluate(() => {
      (window as any).$('#signInModal').modal('hide');
    });
  }
}
