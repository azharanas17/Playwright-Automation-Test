import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { BASE_URL, loginData } from './fixtures/testData';

test.describe('Login Functionality', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto(BASE_URL);
  });

  test.describe('Login Modal', () => {
    test('should open login modal when clicking login link', async ({ page }) => {
      await loginPage.openLoginModal();
      await expect(loginPage.loginModal).toBeVisible();
      await page.screenshot({ path: 'screenshots/login/01-login-modal.png' });
    });

    test('should display all login form elements', async ({ page }) => {
      await loginPage.openLoginModal();
      await expect(loginPage.usernameField).toBeVisible();
      await expect(loginPage.passwordField).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();
      await page.screenshot({ path: 'screenshots/login/02-login-form-elements.png' });
    });
  });

  test.describe('Login Validation', () => {
    test('should show alert with invalid credentials', async ({ page }) => {
      loginPage.page.on('dialog', async (dialog) => {
        expect(dialog.message()).toContain('User does not exist.');
        await dialog.accept();
      });

      await loginPage.login(loginData.invalid.username, loginData.invalid.password);
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'screenshots/login/03-invalid-credentials.png' });
    });

    test('should show alert with empty credentials', async ({ page }) => {
      loginPage.page.on('dialog', async (dialog) => {
        expect(dialog.message()).toContain('Please fill out Username and Password.');
        await dialog.accept();
      });

      await loginPage.login(loginData.empty.username, loginData.empty.password);
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'screenshots/login/04-empty-credentials.png' });
    });

    test('should show alert with only username provided', async ({ page }) => {
      loginPage.page.on('dialog', async (dialog) => {
        expect(dialog.message()).toContain('Please fill out Username and Password.');
        await dialog.accept();
      });

      await loginPage.login(loginData.usernameOnly.username, loginData.usernameOnly.password);
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'screenshots/login/05-username-only.png' });
    });
  });
});
