import type { Context } from "hono";
import type { BtcRpcRequestBody, Env } from "../types";

const ONFINALITY_BTC_HOSTS: Record<string, string> = {
  "bip122:000000000019d6689c085ae165831e93": "bitcoin.api.onfinality.io",
  "bip122:00000000da84f2bafbbc53dee25a72ae": "bitcoin-testnet.api.onfinality.io",
};

export async function btcOnfinalityHandler(c: Context<{ Bindings: Env }>) {
  const networkId = c.req.param("networkId") ?? "";
  const body = c.get("validatedBody" as never) as unknown as BtcRpcRequestBody;

  const host = ONFINALITY_BTC_HOSTS[networkId];
  if (!host) {
    const allowed = Object.keys(ONFINALITY_BTC_HOSTS).join(", ");
    return c.json({ error: `Invalid networkId. Allowed: ${allowed}` }, 400);
  }

  const url = `https://${host}/rpc?apikey=${c.env.ONFINALITY_BTC_API_KEY}`;

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
