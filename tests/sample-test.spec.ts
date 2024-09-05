import { test, expect } from "@playwright/test";

test("open dialog", async ({ page }) => {
  // timeoutの時間を変更
  test.setTimeout(60000);

  await page.goto("http://localhost:5173/userlist");

  // ダイアログを開くボタンが表示されるのを待つ
  await page.waitForSelector('button:has-text("CSV Upload")');

  // ダイアログを開くボタンをクリック
  const openDialogButton = page.locator('button:has-text("CSV Upload")');
  await openDialogButton.click();

  // ダイアログが表示されるのを確認
  const dialog = page.locator('div[role="dialog"] >> text="CSV Upload"');
  await expect(dialog).toBeVisible();
});
