import { test, expect } from "../../fixtures/test";
import { BlocksPage } from "../../pages/blocks.page";
import { DEFAULT_TIMEOUT } from "../../helpers/wait";

test.describe("Blocks Page", () => {
  test("displays blocks list with header and RPCIndicator badge always visible", async ({ page }) => {
    const blocksPage = new BlocksPage(page);
    await blocksPage.goto("1");

    // Wait for loader to disappear
    await expect(blocksPage.loader).toBeHidden({ timeout: DEFAULT_TIMEOUT * 3 });

    // Verify header structure
    await expect(blocksPage.blocksHeader).toBeVisible();
    await expect(blocksPage.blocksHeaderMain).toBeVisible();
    await expect(blocksPage.blockLabel).toBeVisible();
    await expect(blocksPage.blockLabel).toHaveText("Latest Blocks");

    // Verify header info is present
    await expect(blocksPage.blocksHeaderInfo).toBeVisible();
    const infoText = await blocksPage.getInfoText();
    expect(infoText).toMatch(/Showing \d+ most recent blocks/);

    // CRITICAL: Verify RPC Indicator badge is ALWAYS visible
    await expect(blocksPage.rpcIndicator).toBeVisible();
    await expect(blocksPage.rpcBadge).toBeVisible();

    // Verify RPC badge shows strategy
    const badgeText = await blocksPage.getRPCBadgeText();
    expect(badgeText).toMatch(/Fallback|Parallel/);

    // Verify table is present with blocks
    await expect(blocksPage.tableWrapper).toBeVisible();
    await expect(blocksPage.blockTable).toBeVisible();

    const blockCount = await blocksPage.getBlockCount();
    expect(blockCount).toBeGreaterThan(0);
    expect(blockCount).toBeLessThanOrEqual(10); // BLOCKS_PER_PAGE = 10

    // Verify pagination is present
    await expect(blocksPage.paginationContainer).toBeVisible();
    await expect(blocksPage.latestBtn).toBeVisible();
    await expect(blocksPage.newerBtn).toBeVisible();
    await expect(blocksPage.olderBtn).toBeVisible();
  });

  test("RPCIndicator badge is visible in parallel mode", async ({ page }) => {
    const blocksPage = new BlocksPage(page);
    await blocksPage.goto("1");

    await expect(blocksPage.loader).toBeHidden({ timeout: DEFAULT_TIMEOUT * 3 });

    // RPC Indicator should always be present
    await expect(blocksPage.rpcIndicator).toBeVisible();
    await expect(blocksPage.rpcBadge).toBeVisible();

    // Badge should be clickable
    const badgeText = await blocksPage.getRPCBadgeText();
    expect(badgeText.length).toBeGreaterThan(0);
  });

  test("blocks header displays in single line layout", async ({ page }) => {
    const blocksPage = new BlocksPage(page);
    await blocksPage.goto("1");

    await expect(blocksPage.loader).toBeHidden({ timeout: DEFAULT_TIMEOUT * 3 });

    // Verify header main container has flex layout elements
    await expect(blocksPage.blocksHeaderMain).toBeVisible();
    await expect(blocksPage.blockLabel).toBeVisible();

    // Verify divider is present
    const divider = page.locator(".block-header-divider");
    await expect(divider).toBeVisible();
    await expect(divider).toHaveText("•");

    // Verify info is inline with label
    await expect(blocksPage.blocksHeaderInfo).toBeVisible();

    // RPC indicator should be on the same line (or wrapped on mobile)
    await expect(blocksPage.rpcIndicator).toBeVisible();
  });

  test("displays correct block information in table", async ({ page }) => {
    const blocksPage = new BlocksPage(page);
    await blocksPage.goto("1");

    await expect(blocksPage.loader).toBeHidden({ timeout: DEFAULT_TIMEOUT * 3 });

    // Verify table headers
    const table = blocksPage.blockTable;
    await expect(table.locator("th", { hasText: "Block" })).toBeVisible();
    await expect(table.locator("th", { hasText: "Timestamp" })).toBeVisible();
    await expect(table.locator("th", { hasText: "Txns" })).toBeVisible();
    await expect(table.locator("th", { hasText: "Miner" })).toBeVisible();
    await expect(table.locator("th", { hasText: "Gas Used" })).toBeVisible();
    await expect(table.locator("th", { hasText: "Gas Limit" })).toBeVisible();
    await expect(table.locator("th", { hasText: "Size" })).toBeVisible();

    // Verify at least one row exists
    const firstRow = table.locator("tbody tr").first();
    await expect(firstRow).toBeVisible();

    // Verify row contains data
    await expect(firstRow.locator("td").first()).toBeVisible();
  });

  test("pagination buttons work correctly", async ({ page }) => {
    const blocksPage = new BlocksPage(page);
    await blocksPage.goto("1");

    await expect(blocksPage.loader).toBeHidden({ timeout: DEFAULT_TIMEOUT * 3 });

    // On latest page, Latest and Newer should be disabled
    await expect(blocksPage.latestBtn).toBeDisabled();
    await expect(blocksPage.newerBtn).toBeDisabled();

    // Older should be enabled
    await expect(blocksPage.olderBtn).toBeEnabled();

    // Click Older button
    await blocksPage.olderBtn.click();

    // Wait for new blocks to load
    await expect(blocksPage.loader).toBeHidden({ timeout: DEFAULT_TIMEOUT * 3 });

    // Now Newer should be enabled
    await expect(blocksPage.newerBtn).toBeEnabled();

    // RPC indicator should still be visible after navigation
    await expect(blocksPage.rpcIndicator).toBeVisible();
    await expect(blocksPage.rpcBadge).toBeVisible();
  });

  test("RPCIndicator persists when navigating between pages", async ({ page }) => {
    const blocksPage = new BlocksPage(page);
    await blocksPage.goto("1");

    await expect(blocksPage.loader).toBeHidden({ timeout: DEFAULT_TIMEOUT * 3 });

    // Verify RPC indicator is present on first page
    await expect(blocksPage.rpcIndicator).toBeVisible();
    const initialBadgeText = await blocksPage.getRPCBadgeText();

    // Navigate to older blocks
    await blocksPage.olderBtn.click();
    await expect(blocksPage.loader).toBeHidden({ timeout: DEFAULT_TIMEOUT * 3 });

    // Verify RPC indicator is still present
    await expect(blocksPage.rpcIndicator).toBeVisible();
    const newBadgeText = await blocksPage.getRPCBadgeText();

    // Badge text should be consistent
    expect(newBadgeText).toBe(initialBadgeText);

    // Navigate back to latest
    await blocksPage.latestBtn.click();
    await expect(blocksPage.loader).toBeHidden({ timeout: DEFAULT_TIMEOUT * 3 });

    // Verify RPC indicator is still present
    await expect(blocksPage.rpcIndicator).toBeVisible();
    await expect(blocksPage.rpcBadge).toBeVisible();
  });

  test("handles loading state correctly", async ({ page }) => {
    const blocksPage = new BlocksPage(page);

    // Start navigation
    const navigation = blocksPage.goto("1");

    // Loader should be visible initially
    await expect(blocksPage.loader).toBeVisible({ timeout: 5000 });

    // Wait for navigation to complete
    await navigation;

    // Loader should eventually disappear
    await expect(blocksPage.loader).toBeHidden({ timeout: DEFAULT_TIMEOUT * 3 });

    // Content should be visible
    await expect(blocksPage.blocksHeader).toBeVisible();
    await expect(blocksPage.rpcIndicator).toBeVisible();
    await expect(blocksPage.blockTable).toBeVisible();
  });

  test("displays correct block range when using fromBlock parameter", async ({ page }) => {
    const blocksPage = new BlocksPage(page);
    const fromBlock = 1000000;
    await blocksPage.gotoWithFromBlock(fromBlock, "1");

    await expect(blocksPage.loader).toBeHidden({ timeout: DEFAULT_TIMEOUT * 3 });

    // Verify header shows block range instead of "most recent"
    const infoText = await blocksPage.getInfoText();
    expect(infoText).toMatch(/Showing blocks/);
    expect(infoText).not.toMatch(/most recent/);

    // RPC indicator should still be visible
    await expect(blocksPage.rpcIndicator).toBeVisible();
    await expect(blocksPage.rpcBadge).toBeVisible();
  });

  test("RPC indicator has proper styling and layout", async ({ page }) => {
    const blocksPage = new BlocksPage(page);
    await blocksPage.goto("1");

    await expect(blocksPage.loader).toBeHidden({ timeout: DEFAULT_TIMEOUT * 3 });

    // Verify RPC indicator is part of header
    const indicator = blocksPage.rpcIndicator;
    await expect(indicator).toBeVisible();

    // Verify badge is visible and has text
    await expect(blocksPage.rpcBadge).toBeVisible();
    const badgeText = await blocksPage.getRPCBadgeText();
    expect(badgeText.length).toBeGreaterThan(0);

    // Verify header has proper structure
    const header = blocksPage.blocksHeader;
    await expect(header).toBeVisible();

    // Check that header uses flexbox layout (elements are side by side)
    const headerBox = await header.boundingBox();
    const indicatorBox = await indicator.boundingBox();

    expect(headerBox).not.toBeNull();
    expect(indicatorBox).not.toBeNull();

    // Indicator should be within header bounds
    if (headerBox && indicatorBox) {
      expect(indicatorBox.x + indicatorBox.width).toBeLessThanOrEqual(
        headerBox.x + headerBox.width + 1,
      ); // +1 for rounding
    }
  });
});
