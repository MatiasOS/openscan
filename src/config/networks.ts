/**
 * Network configuration for OpenScan
 * Networks are fetched from the explorer-metadata repository
 */

import {
  fetchNetworks,
  getNetworkLogoUrl,
  type NetworkMetadata,
  type NetworksResponse,
} from "../services/MetadataService";
import type { NetworkConfig } from "../types";

export type { NetworkConfig };

// Cache for loaded networks
let loadedNetworks: NetworkConfig[] | null = null;
let networksUpdatedAt: string | null = null;

/**
 * Convert metadata network to NetworkConfig
 */
function metadataToNetworkConfig(network: NetworkMetadata): NetworkConfig {
  return {
    chainId: network.chainId,
    name: network.name,
    shortName: network.shortName,
    description: network.description,
    color: network.color,
    currency: network.currency,
    isTestnet: network.isTestnet,
    logo: network.logo,
    rpc: network.rpc,
    links: network.links,
  };
}

/**
 * Load networks from metadata repository
 * Returns cached networks if already loaded
 */
export async function loadNetworks(): Promise<NetworkConfig[]> {
  if (loadedNetworks) {
    return loadedNetworks;
  }

  const response: NetworksResponse = await fetchNetworks();
  loadedNetworks = response.networks.map(metadataToNetworkConfig);
  networksUpdatedAt = response.updatedAt;
  console.log(
    `Loaded ${loadedNetworks.length} networks from metadata (updated: ${networksUpdatedAt})`,
  );
  return loadedNetworks;
}

/**
 * Get all networks (sync version, returns cached or empty array)
 * Use loadNetworks() for async loading with fresh data
 */
export function getAllNetworks(): NetworkConfig[] {
  return loadedNetworks ?? [];
}

/**
 * Get the list of enabled networks based on environment variable
 * REACT_APP_OPENSCAN_NETWORKS can be a comma-separated list of chain IDs
 * If not set, all networks are enabled
 */
export function getEnabledNetworks(): NetworkConfig[] {
  const allNetworks = getAllNetworks();
  const envNetworks = process.env.REACT_APP_OPENSCAN_NETWORKS;

  if (!envNetworks || envNetworks.trim() === "") {
    return allNetworks;
  }

  // Parse comma-separated chain IDs
  const enabledChainIds = envNetworks
    .split(",")
    .map((id) => parseInt(id.trim(), 10))
    .filter((id) => !Number.isNaN(id));

  if (enabledChainIds.length === 0) {
    return allNetworks;
  }

  // Filter networks by enabled chain IDs, maintaining order from env var
  const enabledNetworks: NetworkConfig[] = [];
  for (const chainId of enabledChainIds) {
    const network = allNetworks.find((n) => n.chainId === chainId);
    if (network) {
      enabledNetworks.push(network);
    }
  }

  return enabledNetworks.length > 0 ? enabledNetworks : allNetworks;
}

/**
 * Get enabled chain IDs as an array
 */
export function getEnabledChainIds(): number[] {
  return getEnabledNetworks().map((n) => n.chainId);
}

/**
 * Check if a chain ID is enabled
 */
export function isChainEnabled(chainId: number): boolean {
  return getEnabledChainIds().includes(chainId);
}

/**
 * Get network config by chain ID
 */
export function getNetworkByChainId(chainId: number): NetworkConfig | undefined {
  return getAllNetworks().find((n) => n.chainId === chainId);
}

/**
 * Get the full URL for a network logo
 */
export function getNetworkLogoUrlByChainId(chainId: number): string | undefined {
  const network = getNetworkByChainId(chainId);
  if (!network) return undefined;
  return getNetworkLogoUrl(network.logo);
}

/**
 * Get the timestamp when networks were last updated
 */
export function getNetworksUpdatedAt(): string | null {
  return networksUpdatedAt;
}

/**
 * Force reload networks from metadata
 */
export async function reloadNetworks(): Promise<NetworkConfig[]> {
  loadedNetworks = null;
  networksUpdatedAt = null;
  return loadNetworks();
}
