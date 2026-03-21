import type { Context } from "hono";
import { ALLOWED_EVM_NETWORKS, type EvmRpcRequestBody, type Env } from "../types";

export async function evmAlchemyHandler(c: Context<{ Bindings: Env }>) {
  const networkId = c.req.param("networkId") ?? "";
  const body = c.get("validatedBody" as never) as unknown as EvmRpcRequestBody;

  const network = ALLOWED_EVM_NETWORKS[networkId];
  if (!network) {
    return c.json({ error: "Unsupported network" }, 400);
  }

  const url = `https://${network.alchemy}.g.alchemy.com/v2/${c.env.ALCHEMY_API_KEY}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        const retryAfter = response.headers.get("Retry-After");
        if (retryAfter) c.header("Retry-After", retryAfter);
        return c.json({ error: "EVM RPC rate limit exceeded" }, 429);
      }
      return c.json({ error: `EVM RPC error (HTTP ${status})` }, 502);
    }

    const data = await response.json();
    return c.json(data);
  } catch {
    return c.json({ error: "Failed to connect to EVM RPC" }, 502);
  }
}

export async function evmInfuraHandler(c: Context<{ Bindings: Env }>) {
  const networkId = c.req.param("networkId") ?? "";
  const body = c.get("validatedBody" as never) as unknown as EvmRpcRequestBody;

  const network = ALLOWED_EVM_NETWORKS[networkId];
  if (!network?.infura) {
    return c.json({ error: "Infura not available for this network" }, 400);
  }

  const url = `https://${network.infura}.infura.io/v3/${c.env.INFURA_API_KEY}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        const retryAfter = response.headers.get("Retry-After");
        if (retryAfter) c.header("Retry-After", retryAfter);
        return c.json({ error: "EVM RPC rate limit exceeded" }, 429);
      }
      return c.json({ error: `EVM RPC error (HTTP ${status})` }, 502);
    }

    const data = await response.json();
    return c.json(data);
  } catch {
    return c.json({ error: "Failed to connect to EVM RPC" }, 502);
  }
}
