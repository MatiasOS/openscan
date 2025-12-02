import { useCallback, useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context";
import { ENSService } from "../services/ENS/ENSService";

interface UseSearchResult {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isResolving: boolean;
  error: string | null;
  clearError: () => void;
  handleSearch: (e: React.FormEvent) => Promise<void>;
  chainId: string | undefined;
}

export function useSearch(): UseSearchResult {
  const [searchTerm, setSearchTerm] = useState("");
  const [isResolving, setIsResolving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { rpcUrls } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract chainId from the pathname (e.g., /1/blocks -> 1)
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const chainId =
    pathSegments[0] && !Number.isNaN(Number(pathSegments[0])) ? pathSegments[0] : undefined;

  const clearError = useCallback(() => setError(null), []);

  const handleSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const term = searchTerm.trim();
      if (!term) return;

      setError(null);

      // Check if it's an ENS name
      if (ENSService.isENSName(term)) {
        setIsResolving(true);
        try {
          const mainnetRpcUrls = rpcUrls[1];
          if (!mainnetRpcUrls || mainnetRpcUrls.length === 0) {
            setError("No Ethereum mainnet RPC configured");
            return;
          }

          const ensService = new ENSService(mainnetRpcUrls);
          const resolvedAddress = await ensService.resolve(term);

          if (resolvedAddress) {
            const targetChainId = chainId || "1";
            navigate(`/${targetChainId}/address/${resolvedAddress}`, {
              state: { ensName: term },
            });
            setSearchTerm("");
          } else {
            setError(`Could not resolve ENS name: ${term}`);
          }
        } catch (err) {
          setError(`Error resolving ENS: ${err instanceof Error ? err.message : "Unknown error"}`);
        } finally {
          setIsResolving(false);
        }
        return;
      }

      // Need chainId for non-ENS searches
      if (!chainId) return;

      // Check if it's a transaction hash (0x followed by 64 hex chars)
      if (/^0x[a-fA-F0-9]{64}$/.test(term)) {
        navigate(`/${chainId}/tx/${term}`);
        setSearchTerm("");
      }
      // Check if it's an address (0x followed by 40 hex chars)
      else if (/^0x[a-fA-F0-9]{40}$/.test(term)) {
        navigate(`/${chainId}/address/${term}`);
        setSearchTerm("");
      }
      // Check if it's a block number
      else if (/^\d+$/.test(term)) {
        navigate(`/${chainId}/block/${term}`);
        setSearchTerm("");
      }
    },
    [searchTerm, chainId, navigate, rpcUrls],
  );

  return {
    searchTerm,
    setSearchTerm,
    isResolving,
    error,
    clearError,
    handleSearch,
    chainId,
  };
}
