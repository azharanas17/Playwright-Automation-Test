import { Page } from '@playwright/test';

export async function handleDialogs(page: Page, action: 'accept' | 'dismiss' = 'accept') {
  page.on('dialog', async (dialog) => {
    if (action === 'accept') {
      await dialog.accept();
    } else {
      await dialog.dismiss();
    }
  });
}

export async function waitForAjaxLoad(page: Page, selector: string, timeout = 10000) {
  await page.waitForSelector(selector, { timeout });
}

export function generateUniqueEmail(prefix = 'user') {
  return `${prefix}_${Date.now()}@test.com`;
}
