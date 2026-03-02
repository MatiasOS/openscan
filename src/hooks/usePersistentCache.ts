import { useCallback } from "react";
import { useSettings } from "../context/SettingsContext";
import { buildPersistentCacheKey, getCachedData, setCachedData } from "../utils/persistentCache";

/**
 * Hook that provides persistent cache operations.
 * All operations are no-ops when super user mode is disabled.
 *
 * Usage:
 *   const { getCached, setCached } = usePersistentCache();
 *   const cached = getCached<Block>("eip155:1", "block", "0x123");
 *   if (!cached) { fetch and then setCached(...) }
 */
export function usePersistentCache() {
  const { isSuperUser, settings } = useSettings();
  const maxSizeBytes = (settings.persistentCacheSizeMB ?? 10) * 1024 * 1024;

  const getCached = useCallback(
    <T>(networkId: string, type: string, identifier: string): T | null => {
      if (!isSuperUser) return null;
      const key = buildPersistentCacheKey(networkId, type, identifier);
      return getCachedData<T>(key);
    },
    [isSuperUser],
  );

  const setCached = useCallback(
    <T>(networkId: string, type: string, identifier: string, data: T): void => {
      if (!isSuperUser) return;
      const key = buildPersistentCacheKey(networkId, type, identifier);
      setCachedData(key, data, maxSizeBytes);
    },
    [isSuperUser, maxSizeBytes],
  );

  return { getCached, setCached };
}
