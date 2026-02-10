import { test, expect } from "@playwright/test";
import * as fs from "fs";

test.use({ bypassCSP: true });

test("Scenario Test: Generate Cards via Debug Input", async ({ page }) => {
  // Listen for console logs
  page.on("console", (msg) => console.log("PAGE LOG:", msg.type(), msg.text()));
  page.on("pageerror", (err) => console.log("PAGE ERROR:", err.message));

  try {
    // 1. Go to home page
    await page.goto("/");

    // Verify page loaded
    await expect(page.locator("body")).toBeVisible();

    // Focus body to ensure key press is captured if needed
    await page.click("body");

    // Screenshot initial state
    await page.screenshot({ path: "test-results/01-home.png" });

    // 2. Open Debug Menu (Scenario Player)
    // Force click in case of overlay
    const summary = page.locator("summary").filter({ hasText: "Scenario" });

    // Check if summary exists
    const count = await summary.count();
    console.log(`Summary elements found: ${count}`);

    if (count === 0) {
      throw new Error("Scenario summary element not found");
    }

    await expect(summary).toBeVisible();
    await summary.click({ force: true });

    // Allow animation time
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "test-results/02-menu-open.png" });

    // 3. Trigger Debug Input via Scenario Player
    const nextButton = page.getByRole("button", { name: "Next Step" });
    await expect(nextButton).toBeVisible();
    await nextButton.click({ force: true });

    // 4. Wait for API response and Card generation
    // Extended timeout for cold start
    // 4. Wait for API response and Card generation
    // Extended timeout for cold start
    const cardText = page.getByText("定例会議").first();
    await expect(cardText).toBeVisible({ timeout: 45000 });
    await page.screenshot({ path: "test-results/03-card-generated.png" });

    // 5. Verify Content
    console.log("Card Content Found");
  } catch (error) {
    console.error("Test Failed:", error);
    await page.screenshot({ path: "test-results/error-state.png" });
    const html = await page.content();
    fs.writeFileSync("test-results/error-state.html", html);
    throw error;
  }
});
