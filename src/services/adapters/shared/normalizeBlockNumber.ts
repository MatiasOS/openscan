import type { BlockNumberOrTag } from "../NetworkAdapter";

/**
 * Normalizes a block number to the format expected by RPC clients
 * Converts numeric block numbers to hex strings, passes through block tags and hex strings unchanged
 *
 * @param blockNumber - Block number as number, hex string, or block tag
 * @returns Block number as hex string or block tag
 */
export function normalizeBlockNumber(blockNumber: BlockNumberOrTag): `0x${string}` | string {
  if (typeof blockNumber === "number") {
    return `0x${blockNumber.toString(16)}`;
  }
  return blockNumber;
}
