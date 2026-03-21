import type { Transaction } from "../types";

const AUTHORIZATION_USED_TOPIC =
  "0x98de503528ee59b575ef0c0a2576a82497bfc029a5685b209e9ec333479b10a5";

const X402_TOKEN_CONTRACTS: Record<number, Set<string>> = {
  1: new Set([
    "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    "0x1aba391a71116973737e6240515c774e81848280",
  ]),
  8453: new Set([
    "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
    "0x60a3e35cc302bfa44cb288bc5a4f316fdb1adb42",
  ]),
  43114: new Set([
    "0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e",
    "0xc891eb4cbdeff6e073e859e98d01fb949588d86d",
  ]),
  137: new Set([
    "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
    "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
  ]),
  10: new Set([
    "0x0b2c639c533413f4021703955881077395293921",
    "0x7f5c764cc27a0c497561e275cc33aa4f09d4e1d6",
  ]),
  42161: new Set([
    "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
    "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8",
  ]),
};

export function detectX402Behavior(
  transactions: Transaction[],
  networkId: number,
  addressHash: string,
): boolean {
  const tokenContracts = X402_TOKEN_CONTRACTS[networkId];
  if (!tokenContracts) return false;

  const normalizedAddress = addressHash.toLowerCase();

  for (const tx of transactions) {
    if (tx.from.toLowerCase() !== normalizedAddress) continue;

    const logs = tx.receipt?.logs;
    if (!logs) continue;

    for (const log of logs) {
      if (
        log.topics?.[0] === AUTHORIZATION_USED_TOPIC &&
        tokenContracts.has(log.address.toLowerCase())
      ) {
        return true;
      }
    }
  }

  return false;
}
