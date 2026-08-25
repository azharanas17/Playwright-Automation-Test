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
    test('should open login modal when clicking login link', async () => {
      await loginPage.openLoginModal();
      await expect(loginPage.loginModal).toBeVisible();
    });

    test('should display all login form elements', async () => {
      await loginPage.openLoginModal();
      await expect(loginPage.usernameField).toBeVisible();
      await expect(loginPage.passwordField).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();
    });
  });

  test.describe('Login Validation', () => {
    test('should show alert with invalid credentials', async () => {
      loginPage.page.on('dialog', async (dialog) => {
        expect(dialog.message()).toContain('User does not exist.');
        await dialog.accept();
      });

      await loginPage.login(loginData.invalid.username, loginData.invalid.password);
    });

    test('should show alert with empty credentials', async () => {
      loginPage.page.on('dialog', async (dialog) => {
        expect(dialog.message()).toContain('Please fill out Username and Password.');
        await dialog.accept();
      });

      await loginPage.login(loginData.empty.username, loginData.empty.password);
    });

    test('should show alert with only username provided', async () => {
      loginPage.page.on('dialog', async (dialog) => {
        expect(dialog.message()).toContain('Please fill out Username and Password.');
        await dialog.accept();
      });

      await loginPage.login(loginData.usernameOnly.username, loginData.usernameOnly.password);
    });
  });
});
