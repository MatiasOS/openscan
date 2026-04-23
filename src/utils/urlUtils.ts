const IPFS_GATEWAY = "https://ipfs.io/ipfs/";

/**
 * Rewrite an `ipfs://` URL to the public HTTPS gateway. Leaves other inputs
 * unchanged.
 */
export function rewriteIpfsUrl(url: string): string {
  return url.startsWith("ipfs://") ? url.replace("ipfs://", IPFS_GATEWAY) : url;
}

/**
 * Return `url` as a safe href (http:, https:, or a rewritten ipfs://) or null
 * for anything else. Rejects javascript:, data:, vbscript:, file:, relative
 * paths, and malformed input.
 *
 * Use for third-party URLs — NFT metadata, AI responses, IPFS documents —
 * where the protocol is attacker-controllable.
 */
export function toSafeExternalHref(url: unknown): string | null {
  if (typeof url !== "string" || url.length === 0) return null;
  const resolved = rewriteIpfsUrl(url);
  try {
    const parsed = new URL(resolved);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? resolved : null;
  } catch {
    return null;
  }
}
