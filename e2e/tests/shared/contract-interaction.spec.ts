import { test, expect } from "../../fixtures/test";
import { DEFAULT_TIMEOUT } from "../../helpers/wait";

/**
 * Contract interaction UI — read/write function lists on verified contracts.
 *
 * The existing per-network specs click individual read functions on BAYC and
 * Rarible but never assert the two top-level section headers render. A
 * regression in `ContractInteraction.tsx` that empties one list (e.g. ABI
 * decoding breaks) would slip through — these smokes catch that.
 *
 * We don't submit any write transaction (wallet signing is out of scope for
 * e2e), only assert the write-function form section renders.
 */

// USDC is the canonical verified ERC-20 — large ABI, many read functions,
// and several write functions. Stable.
const USDC_MAINNET = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

test.describe("Contract interaction UI", () => {
  test("verified ERC-20 renders Read Functions section", async ({ page }) => {
    await page.goto(`/#/1/address/${USDC_MAINNET}`);
    await expect(page.getByText(/Read\s+Functions\s*\(/i)).toBeVisible({
      timeout: DEFAULT_TIMEOUT * 3,
    });
  });

  test("verified ERC-20 renders Write Functions section", async ({ page }) => {
    await page.goto(`/#/1/address/${USDC_MAINNET}`);
    await expect(page.getByText(/Write\s+Functions\s*\(/i)).toBeVisible({
      timeout: DEFAULT_TIMEOUT * 3,
    });
  });

  // Unverified-contract coverage (contract has code but no public source)
  // deferred to phase 6 — picking a stably-unverified contract on mainnet
  // is a research task, and the zero-address fallback in errors.spec.ts
  // already covers the EOA (no-code) path.
});
