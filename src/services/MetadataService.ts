/**
 * Service for fetching metadata from the openscan-explorer/explorer-metadata repository
 */

const METADATA_BASE_URL =
  "https://raw.githubusercontent.com/openscan-explorer/explorer-metadata/main";

export interface NetworkLink {
  name: string;
  url: string;
  description: string;
}

export interface NetworkMetadata {
  chainId: number;
  name: string;
  shortName: string;
  description: string;
  currency: string;
  color: string;
  isTestnet: boolean;
  logo: string;
  rpc: {
    public: string[];
  };
  links: NetworkLink[];
}

export interface NetworksResponse {
  updatedAt: string;
  networks: NetworkMetadata[];
}

// Cache for fetched data
let networksCache: NetworksResponse | null = null;
let networksCacheTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch network configurations from the metadata repository
 */
export async function fetchNetworks(): Promise<NetworksResponse> {
  const now = Date.now();

  // Return cached data if still valid
  if (networksCache && now - networksCacheTime < CACHE_DURATION) {
    return networksCache;
  }

  try {
    const response = await fetch(`${METADATA_BASE_URL}/data/networks.json`);

    if (!response.ok) {
      throw new Error(`Failed to fetch networks: ${response.statusText}`);
    }

    const data: NetworksResponse = await response.json();

    // Update cache
    networksCache = data;
    networksCacheTime = now;

    return data;
  } catch (error) {
    console.error("Error fetching networks from metadata:", error);

    // Return cached data if available, even if stale
    if (networksCache) {
      return networksCache;
    }

    throw error;
  }
}

/**
 * Get the logo URL for a network
 */
export function getNetworkLogoUrl(logoPath: string): string {
  if (logoPath.startsWith("http")) {
    return logoPath;
  }
  return `${METADATA_BASE_URL}/${logoPath}`;
}

/**
 * Clear the networks cache (useful for testing or forced refresh)
 */
export function clearNetworksCache(): void {
  networksCache = null;
  networksCacheTime = 0;
}
