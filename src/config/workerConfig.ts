/** Base URL for the OpenScan Cloudflare Worker proxy */
export const OPENSCAN_WORKER_URL =
  // biome-ignore lint/complexity/useLiteralKeys: env var access
  process.env["REACT_APP_OPENSCAN_WORKER_URL"] ??
  "https://openscan-worker-proxy.openscan.workers.dev";
