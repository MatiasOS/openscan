import type { Context } from "hono";
import { ALLOWED_BEACON_NETWORKS, type Env } from "../types";

const ALCHEMY_BEACON_HOSTS: Record<string, string> = {
  "eth-mainnet": "eth-mainnetbeacon.g.alchemy.com",
  "eth-sepolia": "eth-sepoliabeacon.g.alchemy.com",
};

export async function beaconAlchemyHandler(c: Context<{ Bindings: Env }>) {
  const networkId = c.req.param("networkId") ?? "";
  const slot = c.req.param("slot") ?? "";

  const networkSlug = ALLOWED_BEACON_NETWORKS[networkId];
  if (!networkSlug) {
    return c.json({ error: "Unsupported network" }, 400);
  }

  const host = ALCHEMY_BEACON_HOSTS[networkSlug];
  if (!host) {
    return c.json({ error: "Beacon not available for this network" }, 400);
  }

  const url = `https://${host}/v2/${c.env.ALCHEMY_API_KEY}/eth/v1/beacon/blob_sidecars/${slot}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        const retryAfter = response.headers.get("Retry-After");
        if (retryAfter) c.header("Retry-After", retryAfter);
        return c.json({ error: "Beacon API rate limit exceeded" }, 429);
      }
      if (status === 404) {
        const data = await response.json();
        return c.json(data, 404);
      }
      return c.json({ error: `Beacon API error (HTTP ${status})` }, 502);
    }

    const data = await response.json();
    return c.json(data);
  } catch {
    return c.json({ error: "Failed to connect to Beacon API" }, 502);
  }
}
