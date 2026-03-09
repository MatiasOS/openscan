import { useContext, useEffect, useRef } from "react";
import { AppContext } from "../context/AppContext";
import { useSettings } from "../context/SettingsContext";
import { logger } from "../utils/logger";
import { autoSyncRpcs } from "../utils/rpcAutoSync";

export function useRpcAutoSync(): void {
  const { rpcUrls, setRpcUrls, networksLoading, networks } = useContext(AppContext);
  const { settings, updateSettings } = useSettings();
  const syncedRef = useRef(false); // prevent double-run in React StrictMode

  useEffect(() => {
    if (networksLoading) return;
    if (settings.rpcsSynced) return;
    if (Object.keys(rpcUrls).length === 0) return;
    if (syncedRef.current) return;
    syncedRef.current = true;

    autoSyncRpcs(rpcUrls, networks)
      .then((sorted) => {
        setRpcUrls(sorted);
        updateSettings({ rpcsSynced: true });
      })
      .catch(() => {
        // Don't set rpcsSynced on failure — retry on next load
        logger.warn("Auto-sync RPCs failed");
      });
  }, [networksLoading, settings.rpcsSynced, rpcUrls, networks, setRpcUrls, updateSettings]);
}
