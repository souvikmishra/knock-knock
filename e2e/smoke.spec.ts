import { expect, test } from "@playwright/test";

test("home page connects to Firebase emulators", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Knock Knock" })).toBeVisible();
  await expect(page.getByTestId("firebase-status")).toHaveText("connected", {
    timeout: 15_000,
  });
});
