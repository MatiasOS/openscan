# Testing

OpenScan has two test layers: Vitest for unit tests and Playwright for end-to-end
browser tests against a real Vite dev server. Most test commands also live in
[commands.md](commands.md); this file documents the *model* — projects, suites,
mocking, and CI mapping — so future test work lands in the right place.

## Unit tests (Vitest)

- Config: [vitest.config.ts](../../vitest.config.ts)
- Environment: `happy-dom`, thread pool, globals enabled
- File patterns: `src/**/*.test.ts`, `src/**/*.spec.ts`
- Co-locate unit tests next to the file under test
- Commands:
  ```bash
  npm run test       # watch mode
  npm run test:run   # single pass (use this in CI / one-shot checks)
  ```

## E2E tests (Playwright)

- Config: [playwright.config.ts](../../playwright.config.ts)
- Base URL: `http://localhost:3030`. The `webServer` block auto-starts
  `npm run start` if no server is already running (CI starts a fresh one;
  local runs reuse an existing dev server).
- Defaults: 60s timeout, trace-on-first-retry, screenshot-on-failure, headless,
  3 retries in CI / 1 retry locally, 1 worker in CI.

### Two Playwright projects

```
chromium  → live RPC. Excludes **/shared/mocked/**.
mocked    → hermetic. Only matches **/shared/mocked/**/*.spec.ts.
```

`npm run test:e2e` runs both projects. Use `--project=chromium` or
`--project=mocked` to scope a run.

### Test tree

E2E specs live under [e2e/tests/](../../e2e/tests/) and are organised by
chain family:

| Directory | What's in it |
|-----------|--------------|
| `bitcoin/` | Bitcoin mainnet + Testnet4 specs |
| `eth-mainnet/` | Ethereum mainnet (block, blocks, transaction, txs, address, token) |
| `evm-networks/` | L2s + alt-EVMs (Arbitrum, Base, Optimism, BSC, Polygon, Avalanche, l2-fields) |
| `shared/` | Cross-network specs (live RPC) |
| `shared/mocked/` | Hermetic specs picked up by the `mocked` project |
| `solana/` | Solana specs |
| `testnets/` | Sepolia / testnet-only specs |

### Hermetic vs live

- **Live (`chromium`)**: hits real RPC providers. Subject to rate limits and
  upstream flakiness. CI shards these per network to keep wall-clock low.
- **Mocked (`mocked`)**: uses `page.route` to intercept RPC and worker
  traffic. Use this for any test that asserts on strategy, fallback,
  inconsistency flags, error paths, or large/unusual transactions where
  determinism matters more than realism.

When in doubt, choose mocked — it's faster and won't flake. Only put a spec
in a live folder when the test value depends on real chain state.

### Per-network runners

Iterating on a feature that only touches one chain family? Use the focused
script and skip the rest:

```bash
npm run test:e2e:eth-mainnet     # Ethereum-only
npm run test:e2e:evm-networks    # L2s + alt-EVMs
```

### Single spec / debug / UI

```bash
# One spec
npx playwright test e2e/tests/shared/errors.spec.ts

# Step through a spec interactively
npm run test:e2e:debug

# Time-travel UI mode
npm run test:e2e:ui
```

## CI mapping

Each suite has a dedicated workflow under [.github/workflows/](../../.github/workflows/);
they're sharded so a single flaky live-RPC suite doesn't block the others:

| Workflow | Triggered by |
|----------|--------------|
| `e2e-eth-mainnet.yml` | Ethereum mainnet suite |
| `e2e-evm-networks.yml` | EVM L2 / alt-EVM suite |
| `e2e-bitcoin.yml` | Bitcoin suite |
| `e2e-solana.yml` | Solana suite |
| `e2e-testnets.yml` | Testnet suite |
| `e2e-shared.yml` | Reusable workflow consumed by the others |
| `e2e-all.yml` | Orchestrates all suites |
| `e2e-nightly.yml` | Scheduled nightly run of `e2e-all` |

If a PR only touches Ethereum logic, the eth-mainnet workflow is the
canonical signal. The full `e2e-all` is for release-blocking checks.

## Before pushing tests

1. `npm run test:run` — unit tests pass
2. `npm run test:e2e:<suite>` — at minimum, the suite covering the area you
   changed
3. New live-RPC specs go under `eth-mainnet/`, `evm-networks/`, etc. — never
   under `shared/mocked/`
4. New deterministic specs go under `e2e/tests/shared/mocked/` so the
   `mocked` Playwright project picks them up
