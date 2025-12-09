// src/hooks/useDataService.ts
import { useContext, useMemo } from "react";
import { AppContext } from "../context/AppContext";
import { useSettings } from "../context/SettingsContext";
import { DataService } from "../services/DataService";
import type { SupportedChainId } from "explorer-network-connectors";

/**
 * Hook to get a DataService for a specific network
 * Automatically applies the RPC strategy from user settings
 * @param networkId - The network ID
 * @returns DataService instance
 */
export function useDataService(networkId: number) {
  const { rpcUrls } = useContext(AppContext);
  const { settings } = useSettings();

  const dataService = useMemo(() => {
    return new DataService(networkId as SupportedChainId, rpcUrls, settings.rpcStrategy);
  }, [networkId, rpcUrls, settings.rpcStrategy]);

  return dataService;
}
