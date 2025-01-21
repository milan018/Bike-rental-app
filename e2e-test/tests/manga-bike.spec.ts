import { test, expect } from "@playwright/test";
import path from "path";

const UI_URL = "http://localhost:5173/";

test.beforeEach(async ({ page }) => {
  await page.goto(UI_URL);

  // get the sign in button
  await page.getByRole("link", { name: "Sign In" }).click();

  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  await page.locator("[name=email]").fill("1@1.com");
  await page.locator("[name=password]").fill("password123");

  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByText("Sign in Successful!")).toBeVisible();
});

test("should allow user to add a Bike", async ({ page }) => {
  await page.goto(`${UI_URL}my-bikes`);

  await page.locator('[name="name"]').fill("Test Bike");
  await page.locator('[name="city"]').fill("Test City");
  await page.locator('[name="country"]').fill("Test Country");
  await page
    .locator('[name="description"]')
    .fill("This is a description for the Test BIke");
  await page.locator('[name="pricePerDay"]').fill("100");
  await page.selectOption('select[name="starRating"]', "3");

  await page.getByText("Road Bikes").click();

  await page.getByLabel("Dual-Channel ABS").check();
  await page.getByLabel("Adjustable Suspension").check();
  await page.setInputFiles('[name="imageFiles"]', [
    path.join(__dirname, "files", "1.jpg"),
    path.join(__dirname, "files", "2.jpg"),
  ]);

  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Bike Saved!")).toBeVisible();
});
