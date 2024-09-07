import { test, expect } from "@playwright/test";

test("open dialog in userlist", async ({ page }) => {
  // timeoutの時間を変更
  test.setTimeout(60000);

  await page.goto("http://localhost:5173/userlist");

  // ダイアログを開くボタンをクリック
  await page.getByRole("button", { name: "CSV UPLOAD" }).click();

  // ダイアログが表示されるのを確認
  const dialog = page.locator('div[role="dialog"] >> text="CSV Upload"');
  await expect(dialog).toBeVisible();
});
