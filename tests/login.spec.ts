import { test, expect, Page } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { BASE_URL, loginData } from './fixtures/testData';

function captureDialogMessage(page: Page): Promise<string> {
  return page.waitForEvent('dialog').then(async (dialog) => {
    const message = dialog.message();
    await dialog.accept();
    return message;
  });
}

test.describe('Login Functionality', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto(BASE_URL);
  });

  test.describe('Login Modal', () => {
    test('should open login modal when clicking login link', async ({ page }, testInfo) => {
      await loginPage.openLoginModal();
      await expect(loginPage.loginModal).toBeVisible();
      await page.screenshot({ path: `screenshots/${testInfo.project.name}/login/01-login-modal.png` });
    });

    test('should display all login form elements', async ({ page }, testInfo) => {
      await loginPage.openLoginModal();
      await expect(loginPage.usernameField).toBeVisible();
      await expect(loginPage.passwordField).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();
      await page.screenshot({ path: `screenshots/${testInfo.project.name}/login/02-login-form-elements.png` });
    });
  });

  test.describe('Login Validation', () => {
    test('should show alert with invalid credentials', async ({ page }, testInfo) => {
      const dialogMessage = captureDialogMessage(page);
      await loginPage.login(loginData.invalid.username, loginData.invalid.password);
      await expect(dialogMessage).resolves.toContain('User does not exist.');
      await page.screenshot({ path: `screenshots/${testInfo.project.name}/login/03-invalid-credentials.png` });
    });

    test('should show alert with empty credentials', async ({ page }, testInfo) => {
      const dialogMessage = captureDialogMessage(page);
      await loginPage.login(loginData.empty.username, loginData.empty.password);
      await expect(dialogMessage).resolves.toContain('Please fill out Username and Password.');
      await page.screenshot({ path: `screenshots/${testInfo.project.name}/login/04-empty-credentials.png` });
    });

    test('should show alert with only username provided', async ({ page }, testInfo) => {
      const dialogMessage = captureDialogMessage(page);
      await loginPage.login(loginData.usernameOnly.username, loginData.usernameOnly.password);
      await expect(dialogMessage).resolves.toContain('Please fill out Username and Password.');
      await page.screenshot({ path: `screenshots/${testInfo.project.name}/login/05-username-only.png` });
    });
  });
});