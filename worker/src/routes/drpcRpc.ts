import type { Context } from "hono";
import {
  ALLOWED_EVM_NETWORKS,
  type BtcRpcRequestBody,
  type EvmRpcRequestBody,
  type Env,
} from "../types";

const DRPC_BASE = "https://lb.drpc.org/ogrpc";

export async function evmDrpcHandler(c: Context<{ Bindings: Env }>) {
  const networkId = c.req.param("networkId") ?? "";
  const body = c.get("validatedBody" as never) as unknown as EvmRpcRequestBody;

  const network = ALLOWED_EVM_NETWORKS[networkId];
  if (!network) {
    return c.json({ error: "Unsupported network" }, 400);
  }

  const url = `${DRPC_BASE}?network=${network.drpc}&dkey=${c.env.DRPC_API_KEY}`;

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

export async function btcDrpcHandler(c: Context<{ Bindings: Env }>) {
  const body = c.get("validatedBody" as never) as unknown as BtcRpcRequestBody;
  const url = `${DRPC_BASE}?network=bitcoin&dkey=${c.env.DRPC_API_KEY}`;

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
        return c.json({ error: "Bitcoin RPC rate limit exceeded" }, 429);
      }
      return c.json({ error: `Bitcoin RPC error (HTTP ${status})` }, 502);
    }

    const data = await response.json();
    return c.json(data);
  } catch {
    return c.json({ error: "Failed to connect to Bitcoin RPC" }, 502);
  }
}
