import { logger } from "./logger";

const CACHE_PREFIX = "OPENSCAN_PCACHE_";
const CACHE_VERSION = 1;

interface PersistentCacheEntry<T> {
  data: T;
  storedAt: number;
  lastAccessedAt: number;
  version: number;
}

/**
 * Build a persistent cache key from network ID, data type, and identifier.
 * Format matches DataService cache key convention.
 */
export function buildPersistentCacheKey(
  networkId: string,
  type: string,
  identifier: string,
): string {
  return `${CACHE_PREFIX}${networkId}:${type}:${identifier}`;
}

/**
 * Get cached data by key. Updates lastAccessedAt for LRU tracking.
 * Returns null on cache miss or version mismatch.
 */
export function getCachedData<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const entry: PersistentCacheEntry<T> = JSON.parse(raw);
    if (entry.version !== CACHE_VERSION) {
      localStorage.removeItem(key);
      return null;
    }

    // Update lastAccessedAt for LRU tracking
    entry.lastAccessedAt = Date.now();
    localStorage.setItem(key, JSON.stringify(entry));

    return entry.data;
  } catch {
    logger.warn("Failed to read persistent cache entry:", key);
    return null;
  }
}

/**
 * Store data in the persistent cache with LRU eviction.
 * Evicts least-recently-accessed entries if cache exceeds maxSizeBytes.
 */
export function setCachedData<T>(key: string, data: T, maxSizeBytes: number): void {
  try {
    const entry: PersistentCacheEntry<T> = {
      data,
      storedAt: Date.now(),
      lastAccessedAt: Date.now(),
      version: CACHE_VERSION,
    };

    evictLRU(maxSizeBytes);

    try {
      localStorage.setItem(key, JSON.stringify(entry));
    } catch (err) {
      // Handle QuotaExceededError: evict more aggressively and retry once
      if (err instanceof DOMException && err.name === "QuotaExceededError") {
        evictLRU(Math.floor(maxSizeBytes * 0.5));
        try {
          localStorage.setItem(key, JSON.stringify(entry));
        } catch {
          logger.warn("Persistent cache: quota exceeded even after eviction, skipping write");
        }
      }
    }
  } catch {
    logger.warn("Failed to write persistent cache entry:", key);
  }
}

/**
 * Clear all persistent cache entries from localStorage.
 */
export function clearPersistentCache(): void {
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(CACHE_PREFIX)) {
      keysToRemove.push(key);
    }
  }
  for (const key of keysToRemove) {
    localStorage.removeItem(key);
  }
  logger.info(`Cleared ${keysToRemove.length} persistent cache entries`);
}

/**
 * Get the total size of persistent cache entries in bytes.
 */
export function getPersistentCacheSize(): number {
  let totalSize = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(CACHE_PREFIX)) {
      const value = localStorage.getItem(key);
      if (value) {
        // Each character is 2 bytes in UTF-16 (localStorage encoding)
        totalSize += (key.length + value.length) * 2;
      }
    }
  }
  return totalSize;
}

/**
 * Evict least-recently-accessed entries until cache size is under maxSizeBytes.
 */
function evictLRU(maxSizeBytes: number): void {
  if (getPersistentCacheSize() <= maxSizeBytes) return;

  const entries: Array<{ key: string; lastAccessedAt: number }> = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key?.startsWith(CACHE_PREFIX)) continue;

    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const cached: PersistentCacheEntry<unknown> = JSON.parse(raw);
        entries.push({ key, lastAccessedAt: cached.lastAccessedAt });
      }
    } catch {
      // Remove invalid entries
      if (key) localStorage.removeItem(key);
    }
  }

  // Sort by least recently accessed first
  entries.sort((a, b) => a.lastAccessedAt - b.lastAccessedAt);

  // Remove entries until under the size limit
  for (const entry of entries) {
    if (getPersistentCacheSize() <= maxSizeBytes) break;
    localStorage.removeItem(entry.key);
    logger.debug("Evicted persistent cache entry:", entry.key);
  }
}
