import type { Transaction } from "../types";

/**
 * Known USDC/EURC contracts that emit AuthorizationUsed events.
 *
 * ABI: event AuthorizationUsed(address indexed authorizer, bytes32 indexed nonce)
 */
export const X402_TOKEN_CONTRACTS: Record<number, string[]> = {
  // Ethereum Mainnet
  1: [
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
    "0x1aBa391A71116973737e6240515c774e81848280", // EURC
  ],
  // Base
  8453: [
    "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC
    "0x60a3e35cc302bfa44cb288bc5a4f316fdb1adb42", // EURC
  ],
  // Avalanche
  43114: [
    "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E", // USDC
    "0xC891EB4cbDEff6e073e859e98d01Fb949588d86D", // EURC
  ],
  // Polygon
  137: [
    "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359", // USDC (Native)
    "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // USDC.e (Bridged)
  ],
  // Optimism
  10: [
    "0x0b2C639c533413f4021703955881077395293921", // USDC (Native)
    "0x7F5c764cC27a0C497561E275Cc33AA4f09D4E1d6", // USDC.e (Bridged)
  ],
  // Arbitrum
  42161: [
    "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", // USDC (Native)
    "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8", // USDC.e (Bridged)
  ],
};

/**
 * Keccak-256 hash of "AuthorizationUsed(address,bytes32)"
 * keccak256(toBytes("AuthorizationUsed(address,bytes32)"))
 */
const AUTHORIZATION_USED_TOPIC =
  "0x98de503528ee59b575ef0c0a2576a82497bfc029a5685b209e9ec333479b10a5";

/**
 * Detects if any transaction in the list shows x402 facilitator behavior.
 *
 * An address is a facilitator if it sends a transaction that triggers
 * an AuthorizationUsed event on a supported USDC/EURC contract.
 */
export function detectX402Behavior(
  transactions: Transaction[],
  networkId: number,
  addressHash: string,
): boolean {
  const normalizedAddress = addressHash.toLowerCase();
  const tokenContracts = X402_TOKEN_CONTRACTS[networkId] || [];
  const tokenContractsLower = tokenContracts.map((c) => c.toLowerCase());

  for (const tx of transactions) {
    // Only check transactions sent BY the address
    if (tx.from.toLowerCase() !== normalizedAddress) continue;

    // Check receipt logs
    const logs = tx.receipt?.logs || [];
    for (const log of logs) {
      if (
        tokenContractsLower.includes(log.address.toLowerCase()) &&
        log.topics &&
        log.topics[0] === AUTHORIZATION_USED_TOPIC
      ) {
        return true;
      }
    }
  }

  return false;
}
